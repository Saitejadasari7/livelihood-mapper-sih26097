import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import select
from sqlalchemy.orm import Session
from .. import models

EDU_RANK = {
    "Below 10th": 1,
    "10th Pass": 2,
    "Intermediate": 3,
    "Diploma / ITI": 3,
    "Graduate": 4,
}


def compute_recommendations(user: models.User, db: Session) -> list[dict]:
    profile = user.profile
    user_skill_names = {s.name for s in user.skills}
    livelihoods = db.scalars(select(models.Livelihood)).all()

    if not livelihoods:
        return []

    # Build TF-IDF corpus from livelihood descriptions + sectors + required skills
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
                " ".join(user_skill_names),
            ],
        )
    ).strip()

    tfidf_scores = [0.0] * len(livelihoods)
    if user_query:
        vec = TfidfVectorizer(stop_words="english")
        matrix = vec.fit_transform(docs + [user_query])
        sims = cosine_similarity(matrix[-1], matrix[:-1]).flatten()
        tfidf_scores = [float(s) for s in sims]

    results = []
    for idx, liv in enumerate(livelihoods):
        req_skills = [s.name for s in liv.required_skills]
        have_skills = [s for s in req_skills if s in user_skill_names]
        missing_skills = [s for s in req_skills if s not in user_skill_names]

        # 1. Skill overlap score (0 to 45 pts)
        skill_ratio = (len(have_skills) / len(req_skills)) if req_skills else 0.0
        skill_pts = round(skill_ratio * 45, 1)

        # 2. Sector match score (0 to 25 pts)
        sector_pts = 0.0
        if profile and profile.interest_sector and liv.sector:
            if profile.interest_sector.lower() == liv.sector.lower():
                sector_pts = 25.0

        # 3. Education eligibility score (0 to 15 pts)
        edu_pts = 10.0
        if profile and profile.education_level and liv.suggested_min_education:
            u_rank = EDU_RANK.get(profile.education_level, 2)
            r_rank = EDU_RANK.get(liv.suggested_min_education, 2)
            edu_pts = 15.0 if u_rank >= r_rank else 5.0

        # 4. TF-IDF semantic similarity score (0 to 15 pts)
        tfidf_pts = round(tfidf_scores[idx] * 15, 1)

        total_score = round(skill_pts + sector_pts + edu_pts + tfidf_pts, 1)

        # Check linked NSQF qualifications & training programs (verified only)
        matched_programs = db.scalars(select(models.TrainingProgram)).all()
        nsqf_text = "NSQF mapping not yet verified."
        training_text = "Not yet linked to a verified training program."

        for prog in matched_programs:
            prog_skills = {s.name for s in prog.skills}
            if prog_skills & set(req_skills):
                training_text = f"{prog.title} ({prog.provider}, {prog.duration or 'Duration N/A'})"
                if prog.qualification and prog.qualification.verified:
                    q = prog.qualification
                    nsqf_text = f"NSQF Level {q.nsqf_level} — {q.name} (Code: {q.code})"
                break

        reasons = []
        if have_skills:
            reasons.append(f"Matches {len(have_skills)}/{len(req_skills)} skills ({', '.join(have_skills)})")
        if sector_pts > 0:
            reasons.append(f"Aligns with your {liv.sector} sector interest")
        if tfidf_pts > 0:
            reasons.append(f"Text similarity boost (+{tfidf_pts} pts)")
        if not reasons:
            reasons.append("Entry-level pathway compatible with your profile")

        results.append(
            {
                "livelihood_id": liv.id,
                "title": liv.title,
                "sector": liv.sector,
                "description": liv.description,
                "suggested_min_education": liv.suggested_min_education,
                "score": total_score,
                "breakdown": {
                    "skills": skill_pts,
                    "sector": sector_pts,
                    "education": edu_pts,
                    "tfidf": tfidf_pts,
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

    # Persist top recommendations to database
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