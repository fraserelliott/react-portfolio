import fraser from '../assets/fraser.jpg';
import ProjectPreviewPanel from '../components/ProjectPreviewPanel';
import {useNavigate} from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <AboutSection/>
      <h1 style={{textAlign: 'center', margin: '1rem'}}>Featured Projects</h1>
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
          Having grown up surrounded by programming conversations and books
          thanks to my dad, a software developer, I became interested early on
          by the idea of applying my skills in logic and mathematics to build
          real, tangible solutions. I started teaching myself to code in school,
          beginning with Java and later exploring C#, HTML, CSS, and JavaScript.
          I quickly found ways to apply my skills to help friends and online
          gaming communities, reinforcing my desire to create software and
          websites that are both useful and meaningful.<br/><br/>

          After university, life
          circumstances led me down a different career path. Even so, I
          continued programming as a hobby. Over time, I built confidence and
          developed valuable skills in communication, time management, and
          working in team environments. Recently, I enrolled in a coding
          bootcamp, dedicating over 30 hours a week to deepen my knowledge and
          expand my technical toolkit. Now, I'm eager to keep learning in this
          ever-evolving field and to contribute to meaningful, user-focused
          software as part of a team.
        </p>
      </div>
      <div>
        <img src={fraser} height="150"/>
      </div>
    </section>
  );
};

export default HomePage;
