export default function About() {
  return (
    <div className="page container">
      <h1>About this project</h1>
      <p>
        Livelihood Mapper is a student project for Smart India Hackathon
        (problem statement ID SIH26097). It helps people discover livelihood
        options and skills to learn, based on their education, skills,
        interests and preferences.
      </p>
      <p>
        Recommendations are aligned with the National Skills Qualifications
        Framework (NSQF) only where the qualification details have been
        verified from official sources. Otherwise the app will show
        "NSQF mapping not yet verified."
      </p>
      <div className="notice">
        This page will be updated once we compare the project against the
        official problem statement.
      </div>
    </div>
  );
}