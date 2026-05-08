import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  projects: [],
  activeProject: null,
  isLoading: false,
  isError: false,
  message: '',
};

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const createProject = createAsyncThunk('projects/create', async (projectData, thunkAPI) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (projectId, thunkAPI) => {
  try {
    await api.delete(`/projects/${projectId}`);
    return projectId;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const addMember = createAsyncThunk('projects/addMember', async ({ projectId, email }, thunkAPI) => {
  try {
    const response = await api.post(`/projects/${projectId}/members`, { email });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const removeMember = createAsyncThunk('projects/removeMember', async ({ projectId, userId }, thunkAPI) => {
  try {
    const response = await api.delete(`/projects/${projectId}/members/${userId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setActiveProject: (state, action) => {
      state.activeProject = action.payload;
    },
    clearProjectState: (state) => {
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.isLoading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
      })
      .addCase(addMember.fulfilled, (state, action) => {
        const idx = state.projects.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.projects[idx] = action.payload;
        if (state.activeProject?.id === action.payload.id) state.activeProject = action.payload;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        const idx = state.projects.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.projects[idx] = action.payload;
        if (state.activeProject?.id === action.payload.id) state.activeProject = action.payload;
      });
  },
});

export const { setActiveProject, clearProjectState } = projectSlice.actions;
export default projectSlice.reducer;
