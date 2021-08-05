import React from 'react';

export interface ProjectState {
  sidenavExpanded: boolean;
  chatExpanded: boolean;
  showTradeDialog: boolean;
}

export interface ProjectAction {
  type: 'set' | 'set-sidenav-expanded' | 'set-chat-expanded' | 'show-trade-dialog';
  payload: any;
}

const initialState: any = { projectId: null };

export const ProjectContext = React.createContext<[ProjectState, React.Dispatch<ProjectAction>]>(initialState);

export function ProjectStateProvider(props: { children: JSX.Element | JSX.Element[] }) {

  return (
    <ProjectContext.Provider value={React.useReducer(reducer, initialState) as any}>
      {props.children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => React.useContext(ProjectContext);