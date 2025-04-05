import React, { useState, useEffect } from 'react';
import {
  makeAuthenticatedRequest,
  makeAuthenticatedPutRequest,
  makeAuthenticatedDeleteRequest,
  makeAuthenticatedFilePutRequest,
  getUserId
} from '../../services/auth.service';
import Notification from '../EduconnectStudentPage/Notification';
import Loader from '../EduconnectLoginPage/Loader';
import LoginError from '../EduconnectLoginPage/LoginError';
import './ModuleManagement.css';

const ModuleManagement = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [editModuleForm, setEditModuleForm] = useState({ name: '', semester: '' });
  const [editResourceForm, setEditResourceForm] = useState({ title: '', description: '' });
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [sortOrder, setSortOrder] = useState('asc'); // State for sort order

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await makeAuthenticatedRequest('/modules');
      setModules(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch modules: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  // Filter and sort modules based on search query and sort order
  const filteredAndSortedModules = modules
    .filter(module =>
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.semester.toString().includes(searchQuery)
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.semester - b.semester;
      } else {
        return b.semester - a.semester;
      }
    });

  const showNotification = (title, description, type) => {
    setNotification({ title, description, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await makeAuthenticatedDeleteRequest(`/modules/${moduleId}`);
        setModules(modules.filter(module => module.id !== moduleId));
        showNotification('Success', 'Module deleted successfully!', 'success');
      } catch (err) {
        showNotification('Error', 'Failed to delete module: ' + (err.response?.data?.message || err.message), 'error');
      }
    }
  };

  const handleEditModule = (module) => {
    setEditingModule(module.id);
    setEditModuleForm({ name: module.name, semester: module.semester });
  };

  const handleModuleInputChange = (e) => {
    const { name, value } = e.target;
    setEditModuleForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditModuleSubmit = async (moduleId) => {
    try {
      const updatedModule = await makeAuthenticatedPutRequest(`/modules/${moduleId}`, editModuleForm);
      setModules(modules.map(module =>
        module.id === moduleId ? updatedModule : module
      ));
      setEditingModule(null);
      showNotification('Success', 'Module updated successfully!', 'success');
    } catch (err) {
      showNotification('Error', 'Failed to update module: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleDeleteResource = async (moduleId, resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const teacherId = getUserId();
        await makeAuthenticatedDeleteRequest(`/teacher/resources/${resourceId}?teacherId=${teacherId}`);
        setModules(modules.map(module =>
          module.id === moduleId
            ? { ...module, resources: module.resources.filter(r => r.id !== resourceId) }
            : module
        ));
        showNotification('Success', 'Resource deleted successfully!', 'success');
      } catch (err) {
        showNotification('Error', 'Failed to delete resource: ' + (err.response?.data?.message || err.message), 'error');
      }
    }
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource.id);
    setEditResourceForm({ title: resource.title, description: resource.description });
  };

  const handleResourceInputChange = (e) => {
    const { name, value } = e.target;
    setEditResourceForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditResourceSubmit = async (moduleId, resourceId) => {
    try {
      const teacherId = getUserId();
      if (!teacherId || teacherId === 'null') {
        setError('Teacher ID is missing. Please log in again.');
        return;
      }

      const formData = new FormData();
      formData.append('title', editResourceForm.title);
      formData.append('description', editResourceForm.description);
      formData.append('teacherId', teacherId);

      const updatedResource = await makeAuthenticatedFilePutRequest(`/teacher/resources/${resourceId}`, formData);

      setModules(modules.map(module =>
        module.id === moduleId
          ? {
            ...module,
            resources: module.resources.map(r =>
              r.id === resourceId ? updatedResource : r
            )
          }
          : module
      ));
      setEditingResource(null);
      showNotification('Success', 'Resource updated successfully!', 'success');
    } catch (err) {
      showNotification('Error', 'Failed to update resource: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  if (loading) {
    return (
      <div id="loading-container">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div id="error-message">
        <LoginError message="Operation failed" description={error} />
      </div>
    );
  }

  return (
    <div>
      <div className="container-fluid text-white">
        <div id="EduModuleManager-Logo-row" className="row">
          <div id="EduModuleManager-Logo-col" className="col-6 d-flex justify-content-start align-items-center ps-4">
            EDUCONNECT
          </div>
        </div>
      </div>
      <div id="modulemanager-main">
        <div id="module-management-container">
          <h1 id="EduModuleManager-title">Module Management</h1>

          {/* Search and Sort Options */}
          <div className="search-sort-container">
            <input
              type="text"
              placeholder="Search by module name or semester"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-select"
            >
              <option value="asc">Sort by Semester (Ascending)</option>
              <option value="desc">Sort by Semester (Descending)</option>
            </select>
          </div>

          <div id="modules-list">
            {filteredAndSortedModules.map(module => (
              <div key={module.id} id={`module-card-${module.id}`} className="module-card">
                <div id={`module-details-${module.id}`} className="module-details">
                  {editingModule === module.id ? (
                    <div id={`edit-module-form-${module.id}`} className="edit-form">
                      <input
                        type="text"
                        name="name"
                        value={editModuleForm.name}
                        onChange={handleModuleInputChange}
                        placeholder="Module Name"
                      />
                      <input
                        type="number"
                        name="semester"
                        value={editModuleForm.semester}
                        onChange={handleModuleInputChange}
                        placeholder="Semester"
                      />
                      <button id={`save-module-btn-${module.id}`} onClick={() => handleEditModuleSubmit(module.id)}>Save</button>
                      <button id={`cancel-module-btn-${module.id}`} onClick={() => setEditingModule(null)}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <h2>{module.name}</h2>
                      <p>Semester: {module.semester}</p>
                      <div className="button-group">
                        <button id={`edit-module-btn-${module.id}`} onClick={() => handleEditModule(module)}>Edit Module</button>
                        <button id={`delete-module-btn-${module.id}`} onClick={() => handleDeleteModule(module.id)}>Delete Module</button>
                      </div>
                    </>
                  )}
                </div>

                <div id={`resources-section-${module.id}`} className="resources-section">
                  <h3>Resources</h3>
                  {module.resources && module.resources.length > 0 ? (
                    module.resources.map(resource => (
                      <div key={resource.id} id={`resource-item-${resource.id}`} className="resource-block">
                        {editingResource === resource.id ? (
                          <div id={`edit-resource-form-${resource.id}`} className="edit-form">
                            <input
                              type="text"
                              name="title"
                              value={editResourceForm.title}
                              onChange={handleResourceInputChange}
                              placeholder="Resource Title"
                            />
                            <input
                              type="text"
                              name="description"
                              value={editResourceForm.description}
                              onChange={handleResourceInputChange}
                              placeholder="Description"
                            />
                            <button id={`save-resource-btn-${resource.id}`} onClick={() => handleEditResourceSubmit(module.id, resource.id)}>Save</button>
                            <button id={`cancel-resource-btn-${resource.id}`} onClick={() => setEditingResource(null)}>Cancel</button>
                          </div>
                        ) : (
                          <>
                            <p>{resource.title} - {resource.description}</p>
                            <a href={`http://192.168.137.1:8100${resource.fileUrl}`} target="_blank" rel="noopener noreferrer">Download</a>
                            <div className="button-group">
                              <button id={`edit-resource-btn-${resource.id}`} onClick={() => handleEditResource(resource)}>Edit Resource</button>
                              <button id={`delete-resource-btn-${resource.id}`} onClick={() => handleDeleteResource(module.id, resource.id)}>Delete Resource</button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No resources available</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer>
        <div className="container-fluid">
          <div id="EduModuleManager-footer-row" className="row">
            <div id="EduModuleManager-footer-col" className="col-12 d-flex flex-column justify-content-center align-items-center mt-4 mb-4">
              © {new Date().getFullYear()} EDUConnect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      {notification && (
        <Notification
          title={notification.title}
          description={notification.description}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

export default ModuleManagement;