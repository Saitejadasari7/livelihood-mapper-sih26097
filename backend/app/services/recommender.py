import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import select
from sqlalchemy.orm import Session
from .. import models

EDU_RANK = {
    "Below 10th": 1,
    "Class 5-8": 1,
    "10th Pass": 2,
    "Intermediate": 3,
    "Diploma / ITI": 4,
    "Graduate": 5,
    "Postgraduate / Ph.D.": 6,
}

NEXT_TIER_UPGRADE = {
    "Levels 1–2": {
        "next_levels": "Levels 3–4",
        "next_tier": "Semi-Skilled to Skilled",
        "advice": "Complete Class 10 / ITI certification + digital literacy to unlock Level 3–4 roles.",
    },
    "Levels 3–4": {
        "next_levels": "Levels 5–6",
        "next_tier": "Supervisory / Technical",
        "advice": "Pursue a Diploma / UG Year 1–2 + team supervision skills to advance to Level 5–6.",
    },
    "Levels 5–6": {
        "next_levels": "Levels 7–8",
        "next_tier": "Managerial / Specialized",
        "advice": "Complete a Bachelor’s degree + domain analytics/management skills for Level 7–8.",
    },
    "Levels 7–8": {
        "next_levels": "Levels 9–10",
        "next_tier": "Strategic / Research",
        "advice": "Pursue Master’s / Ph.D. research & system architecture leadership for Level 9–10.",
    },
    "Levels 9–10": {
        "next_levels": "Apex Strategic Tier",
        "next_tier": "Principal R&D / Policy Leadership",
        "advice": "Lead national-scale R&D initiatives, patents, and sectoral skill standards.",
    },
}


def get_nsqf_tier_info(edu_or_level) -> dict:
    if isinstance(edu_or_level, int):
        if edu_or_level <= 2:
            return {"levels": "Levels 1–2", "tier": "Foundational / Entry", "benchmark": "Class 5–8 / Basic Literacy"}
        if edu_or_level <= 4:
            return {"levels": "Levels 3–4", "tier": "Semi-Skilled to Skilled", "benchmark": "Class 9–12 / ITI Certificate"}
        if edu_or_level <= 6:
            return {"levels": "Levels 5–6", "tier": "Supervisory / Technical", "benchmark": "Diploma / Undergraduate Year 1–2"}
        if edu_or_level <= 8:
            return {"levels": "Levels 7–8", "tier": "Managerial / Specialized", "benchmark": "Bachelor’s / Postgraduate Degree"}
        return {"levels": "Levels 9–10", "tier": "Strategic / Research", "benchmark": "Master’s / Ph.D."}

    rank = EDU_RANK.get(edu_or_level or "", 2)
    mapping = {
        1: {"levels": "Levels 1–2", "tier": "Foundational / Entry", "benchmark": "Class 5–8 / Basic Literacy"},
        2: {"levels": "Levels 3–4", "tier": "Semi-Skilled to Skilled", "benchmark": "Class 9–12 / ITI Certificate"},
        3: {"levels": "Levels 3–4", "tier": "Semi-Skilled to Skilled", "benchmark": "Class 9–12 / ITI Certificate"},
        4: {"levels": "Levels 5–6", "tier": "Supervisory / Technical", "benchmark": "Diploma / Undergraduate Year 1–2"},
        5: {"levels": "Levels 7–8", "tier": "Managerial / Specialized", "benchmark": "Bachelor’s / Postgraduate Degree"},
        6: {"levels": "Levels 9–10", "tier": "Strategic / Research", "benchmark": "Master’s / Ph.D."},
    }
    return mapping[rank]


def compute_recommendations(user: models.User, db: Session, persist: bool = False) -> list[dict]:
    profile = user.profile
    user_skill_names_lower = {s.name.lower() for s in user.skills}
    livelihoods = db.scalars(select(models.Livelihood)).all()

    if not livelihoods:
        return []

    docs = [
        f"{l.title} {l.sector or ''} {l.description or ''} {' '.join(s.name for s in l.required_skills)}"
        for l in livelihoods
    ]
    user_query = " ".join(
        filter(
            None,
            [
                profile.interest_sector if profile else "",
                profile.career_preference if profile else "",
                profile.education_level if profile else "",
                " ".join(s.name for s in user.skills),
            ],
        )
    ).strip()

    tfidf_scores = [0.0] * len(livelihoods)
    if user_query:
        vec = TfidfVectorizer(stop_words="english")
        matrix = vec.fit_transform(docs + [user_query])
        sims = cosine_similarity(matrix[-1], matrix[:-1]).flatten()
        tfidf_scores = [float(s) for s in sims]

    matched_programs = db.scalars(select(models.TrainingProgram)).all()
    results = []

    for idx, liv in enumerate(livelihoods):
        req_skills = [s.name for s in liv.required_skills]
        have_skills = [s for s in req_skills if s.lower() in user_skill_names_lower]
        missing_skills = [s for s in req_skills if s.lower() not in user_skill_names_lower]

        # 1. Skill overlap (0 to 45 pts)
        skill_ratio = (len(have_skills) / len(req_skills)) if req_skills else 0.0
        skill_pts = round(skill_ratio * 45, 1)

        # 2. Sector match (0 to 25 pts)
        sector_pts = 0.0
        if profile and profile.interest_sector and liv.sector:
            if profile.interest_sector.lower() == liv.sector.lower():
                sector_pts = 25.0

        # 3. Education / NSQF benchmark fit (0 to 15 pts)
        edu_pts = 10.0
        if profile and profile.education_level and liv.suggested_min_education:
            u_rank = EDU_RANK.get(profile.education_level, 2)
            r_rank = EDU_RANK.get(liv.suggested_min_education, 2)
            if u_rank == r_rank:
                edu_pts = 15.0
            elif u_rank > r_rank:
                edu_pts = 11.0
            else:
                edu_pts = 4.0

        # 4. TF-IDF semantic similarity (0 to 15 pts)
        tfidf_pts = round(tfidf_scores[idx] * 15, 1)
        total_score = round(skill_pts + sector_pts + edu_pts + tfidf_pts, 1)

        nsqf_text = "NSQF mapping not yet verified."
        training_text = "Not yet linked to a verified training program."
        tier_info = get_nsqf_tier_info(liv.suggested_min_education)

        for prog in matched_programs:
            prog_skills = {s.name.lower() for s in prog.skills}
            req_lower = {s.lower() for s in req_skills}
            if prog_skills and len(prog_skills & req_lower) >= 2:
                training_text = f"{prog.title} ({prog.provider}, {prog.duration or 'Duration N/A'})"
                if prog.qualification and prog.qualification.verified:
                    q = prog.qualification
                    tier_info = get_nsqf_tier_info(q.nsqf_level)
                    nsqf_text = f"NSQF Level {q.nsqf_level} ({tier_info['tier']}) — {q.name} [Code: {q.code}]"
                break

        reasons = []
        if have_skills:
            reasons.append(f"Matches {len(have_skills)}/{len(req_skills)} skills ({', '.join(have_skills)})")
        if sector_pts > 0:
            reasons.append(f"Aligns with your {liv.sector} sector interest")
        if edu_pts >= 15.0:
            reasons.append(f"Direct match for {tier_info['levels']} ({tier_info['benchmark']})")
        if tfidf_pts > 0:
            reasons.append(f"TF-IDF semantic boost (+{tfidf_pts} pts)")
        if not reasons:
            reasons.append(f"Compatible with {tier_info['levels']} ({tier_info['tier']})")

        try:
            translations = json.loads(liv.translations_json or "{}")
        except json.JSONDecodeError:
            translations = {}

        results.append(
            {
                "livelihood_id": liv.id,
                "title": liv.title,
                "translations": translations,
                "sector": liv.sector,
                "description": liv.description,
                "suggested_min_education": liv.suggested_min_education,
                "nsqf_levels": tier_info["levels"],
                "competency_tier": tier_info["tier"],
                "academic_benchmark": tier_info["benchmark"],
                "upgrade_pathway": NEXT_TIER_UPGRADE.get(tier_info["levels"]),
                "score": total_score,
                "breakdown": {
                    "skills": skill_pts,
                    "sector": sector_pts,
                    "education": edu_pts,
                    "tfidf": tfidf_pts,
                },
                "reason_meta": {
                    "matched_count": len(have_skills),
                    "total_req": len(req_skills),
                    "sector_matched": sector_pts > 0,
                    "edu_exact": edu_pts >= 15.0,
                    "tfidf_pts": tfidf_pts,
                },
                "have_skills": have_skills,
                "missing_skills": missing_skills,
                "why": "; ".join(reasons) + ".",
                "training": training_text,
                "nsqf": nsqf_text,
                "next": (
                    f"Learn missing skills: {', '.join(missing_skills)}"
                    if missing_skills
                    else "All core skills matched — ready for NSQF certification."
                ),
            }
        )

    results.sort(key=lambda x: x["score"], reverse=True)

    if persist:
        db.query(models.Recommendation).filter(models.Recommendation.user_id == user.id).delete()
        for item in results:
            db.add(
                models.Recommendation(
                    user_id=user.id,
                    livelihood_id=item["livelihood_id"],
                    score=item["score"],
                    explanation=json.dumps(item["breakdown"]),
                )
            )
        db.commit()

    return results