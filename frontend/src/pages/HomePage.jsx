import fraser from "../assets/fraser.jpg";
import ProjectPreviewPanel from "../components/ProjectPreviewPanel";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <AboutSection />
      <h1 style={{ textAlign: "center", margin: "1rem" }}>Featured Projects</h1>
      <ProjectPreviewPanel
        featured
        onClick={(project) => {
          navigate(`/project?id=${project.id}`);
        }}
      />
    </>
  );
};

const AboutSection = () => {
  return (
    <section className="panel flex flex-row-desktop align-center w-l my-2">
      <div className="flex-grow">
        <h1 className="my-1 mx-1">Hi, I'm Fraser.</h1>
        <p className="mx-1">
          Having grown up surrounded by programming through my dad, a software
          developer, I became interested early on in building real, tangible
          solutions. I started teaching myself to code in school, beginning with
          Java and later exploring C#, HTML, CSS, and JavaScript. I quickly
          found ways to apply those skills to help friends and online
          communities, reinforcing my interest in building software that is both
          useful and meaningful.
          <br />
          <br />
          I’m now looking for a junior developer role where I can continue
          learning and contribute to real-world projects.
        </p>
      </div>
      <div>
        <img src={fraser} height="150" />
      </div>
    </section>
  );
};

export default HomePage;
