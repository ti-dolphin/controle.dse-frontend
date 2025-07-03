import { useCallback, useEffect, useState } from 'react';
import { ProjectService } from '../services/ProjectService';
import { Project } from '../models/Project';
import { useDispatch } from 'react-redux';
import { setFeedback } from '../redux/slices/feedBackSlice';
import { Option } from '../types';


export function useProjectOptions() {
    const dispatch = useDispatch();
    const [options, setOptions] = useState<Option[]>([]);

    const fetchProjects = useCallback(async () => {
        try { 
            const projects: Project[] = await ProjectService.getMany({});
            const options = projects.map((proj: Project) => ({
              id: proj.ID,
              name: String(proj.DESCRICAO),
            }));
           
            setOptions(options);
        } catch (e: any) { 
            dispatch(setFeedback({ 
                type: 'error',
                message: `Erro ao buscar opções de projetos: ${e.message}`
            }));
        }
    }, [dispatch]);

    useEffect(() => { 
        fetchProjects();

    }, [fetchProjects]);

    return { projectOptions: options };
}