import { Link } from "react-router-dom";

const features = [
  { title: "Voice and text assistant", text: "Speak or type your answers. Works in the browser.", soon: "Phase 5" },
  { title: "Livelihood mapping", text: "Find work options that match your education, skills and interests.", soon: "Phase 6" },
  { title: "Skill gap analysis", text: "See which skills you already have and which to learn next.", soon: "Phase 8" },
  { title: "NSQF-aligned training", text: "Training paths linked to verified NSQF information only.", soon: "Phase 7" },
  { title: "Personal dashboard", text: "Keep your profile and recommendations in one place.", soon: "Phase 2B" },
  { title: "Career pathways", text: "Understand possible next steps after each stage.", soon: "Phase 6" },
];

const steps = [
  { title: "Tell us about you", text: "Share your education, skills and interests." },
  { title: "We analyse your profile", text: "Our matching rules compare it with livelihood options." },
  { title: "See your gaps", text: "Find out which skills are missing." },
  { title: "Get a learning path", text: "View suggested training and next steps." },
];

const benefits = [
  "Simple language and large text",
  "Speak instead of typing",
  "Clear reasons for every suggestion",
  "No guaranteed-job claims",
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Find work and skills that fit you, just by talking</h1>
          <p>
            Tell our assistant about your education and skills. Get livelihood
            options and training paths aligned with the National Skills
            Qualifications Framework (NSQF).
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-light">Start Now</Link>
            <Link to="/voice" className="btn btn-outline">Try Voice Assistant</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Key features</h2>
          <p className="section-sub">Features marked "Coming soon" are still being built.</p>
          <div className="grid grid-3">
            {features.map((f) => (
              <div className="card" key={f.title}>
                <span className="badge badge-soon">Coming soon ({f.soon})</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <p className="section-sub">Four simple steps.</p>
          <div className="grid grid-4">
            {steps.map((s, i) => (
              <div className="card" key={s.title}>
                <div className="step-num">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Why use it</h2>
          <div className="grid grid-4" style={{ marginTop: 28 }}>
            {benefits.map((b) => (
              <div className="card" key={b}><p><strong>{b}</strong></p></div>
            ))}
          </div>
          <div className="notice" style={{ marginTop: 32 }}>
            Suggestions are guidance based on your answers. They are not job
            offers or verified vacancies.
          </div>
        </div>
      </section>
    </>
  );
}