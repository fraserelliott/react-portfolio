import fraser from '../assets/fraser.jpg';
import ProjectPreviewPanel from '../components/ProjectPreviewPanel';
import { useGlobalStore } from '../components/GlobalStoreProvider';

const HomePage = () => {
  const [currentProject, setCurrentProject] = useGlobalStore('currentProject');
  const [currentPage, setCurrentPage] = useGlobalStore('currentPage');

  const handlePreviewClick = (project) => {
    setCurrentPage('projects');
    setCurrentProject(project);
  };

  return (
    <>
      <AboutSection />
      <h1 style={{ textAlign: 'center', margin: '1rem' }}>Featured Projects</h1>
      <ProjectPreviewPanel
        featured
        onClick={(project) => handlePreviewClick(project)}
      />
    </>
  );
};

// TODO: update text with intro from CV
const AboutSection = () => {
  return (
    <section className="panel flex flex-row-desktop align-center w-l my-2">
      <div className="flex-grow">
        <h1 className="my-1 ">Hi, I'm Fraser.</h1>
        <p className="mx-1">
          I am an aspiring developer who started using C# for Windows
          applications and games before branching into other technologies. I am
          currently doing a level 4 qualification in full stack development. My
          academic background is in mathematics and statistics and I'm looking
          to apply my problem solving skills in a career in development.
          <br />
          <br />
          I've used a range of technologies as I've been learning to program
          including:
        </p>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>C# including WPF</li>
          <li>Python</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>Javascript including Node.js</li>
          <li>Java including Java Android SDK</li>
        </ul>
      </div>
      <div>
        <img src={fraser} height="150" />
      </div>
    </section>
  );
};

export default HomePage;
