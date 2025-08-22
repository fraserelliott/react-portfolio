import {
  createContext, useState, useEffect, useContext,
  useCallback, useMemo
} from "react";
import api from "../api";
import {useApi} from "./ApiContext.jsx";

export const ProjectsContext = createContext({
  projects: [],
  tags: [],
  loading: true,
  error: null,
  addProjectAsync: async () => null,
  updateProjectAsync: async () => null,
  deleteProjectAsync: async () => null,
  addTagAsync: async () => null,
});

export function ProjectsProvider({children}) {
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {runApi} = useApi();

  useEffect(() => {
    let mounted = true;
    (async () => {
      await Promise.all([
        runApi(
          api.get("/api/posts"),
          (d) => mounted && setProjects(d),
          "Error fetching posts",
          () => mounted && setError(new Error("Failed to load projects"))
        ),
        runApi(
          api.get("/api/tags"),
          (d) => mounted && setTags(d),
          "Error fetching tags",
          () => mounted && setError(new Error("Failed to load tags"))
        ),
      ]);
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [runApi]);

  const addProjectAsync = useCallback(async (project) => {
    return runApi(
      api.post("/api/posts", project),
      (newProject) => setProjects(prev => [...prev, newProject]),
      "Error adding project"
    );
  }, [runApi]);

  const updateProjectAsync = useCallback(async (project) => {
    return runApi(
      api.put(`/api/posts/${project.id}`, project),
      (updated) => setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p))),
      "Error updating project"
    );
  }, [runApi]);

  const deleteProjectAsync = useCallback(async (id) => {
    return runApi(
      api.delete(`/api/posts/${id}`),
      () => setProjects(prev => prev.filter(p => p.id !== id)),
      "Error deleting project"
    );
  }, [runApi]);

  const addTagAsync = useCallback(async (tag) => {
    return runApi(
      api.post("/api/tags", tag),
      (newTag) => setTags(prev => [...prev, newTag]),
      "Error adding tag"
    );
  }, [runApi]);

  const value = useMemo(() => ({
    projects,
    tags,
    loading,
    error,
    addProjectAsync,
    updateProjectAsync,
    deleteProjectAsync,
    addTagAsync,
  }), [
    projects, tags, loading, error,
    addProjectAsync, updateProjectAsync, deleteProjectAsync, addTagAsync
  ]);

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export const useProjects = () => useContext(ProjectsContext);