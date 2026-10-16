import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Initial sample data using a new storage key (v4) to bypass browser cache
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('limkokwing_students_v4');
    if (savedStudents) {
      return JSON.parse(savedStudents);
    }
    return [
      { id: '901020999', name: 'Lineo Mosenene', age: 21, email: 'lineomosenene@limkokwing.ac.ls', course: 'Diploma in Information Technology', status: 'Active' },
      { id: '901020567', name: 'Nthabiseng Mohale', age: 20, email: 'nthabisengmohale@limkokwing.ac.ls', course: 'Diploma in Business Management', status: 'Active' },
      { id: '901018765', name: 'Peete Lesaoana', age: 23, email: 'peetelesaoana@limkokwing.ac.ls', course: 'Diploma in Information Technology', status: 'Inactive' }
    ];
  });

  // Modal visibility states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states and active selection for editing/deleting
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
    email: '',
    course: 'Diploma in Information Technology',
    status: 'Active'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Synchronize state changes to localStorage for data persistence
  useEffect(() => {
    localStorage.setItem('limkokwing_students_v4', JSON.stringify(students));
  }, [students]);

  // Validation function for student records
  const validateForm = (data, isEditing = false) => {
    if (!data.id.trim() || !data.name.trim() || !data.age || !data.email.trim()) {
      return "All fields are required.";
    }
    const numericAge = Number(data.age);
    if (isNaN(numericAge) || numericAge < 16 || numericAge > 100) {
      return "Please enter a valid age between 16 and 100.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return "Please enter a valid email address.";
    }
    // Check for duplicate ID on creation (or if ID changed during editing)
    if (!isEditing || (currentStudent && data.id.trim() !== currentStudent.id)) {
      if (students.some(s => s.id.toLowerCase() === data.id.trim().toLowerCase())) {
        return "A student with this Student ID already exists.";
      }
    }
    return "";
  };

  // Handler to open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      id: '',
      name: '',
      age: '',
      email: '',
      course: 'Diploma in Information Technology',
      status: 'Active'
    });
    setErrorMsg('');
    setIsAddModalOpen(true);
  };

  // Handler to submit new student
  const handleAddStudent = (e) => {
    e.preventDefault();
    const validationError = validateForm(formData, false);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    const newStudent = {
      ...formData,
      age: Number(formData.age),
      id: formData.id.trim(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase()
    };

    setStudents(prevStudents => [newStudent, ...prevStudents]);
    setIsAddModalOpen(false);
  };

  // Handler to open Edit Modal
  const handleOpenEditModal = (student) => {
    setCurrentStudent(student);
    setFormData({ ...student });
    setErrorMsg('');
    setIsEditModalOpen(true);
  };

  // Handler to update existing student
  const handleUpdateStudent = (e) => {
    e.preventDefault();
    const validationError = validateForm(formData, true);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setStudents(prevStudents =>
      prevStudents.map(s => (s.id === currentStudent.id ? { ...formData, age: Number(formData.age), id: formData.id.trim() } : s))
    );
    setIsEditModalOpen(false);
  };

  // Handler to open Delete Confirmation Modal
  const handleOpenDeleteModal = (student) => {
    setCurrentStudent(student);
    setIsDeleteModalOpen(true);
  };

  // Handler to confirm deletion
  const handleDeleteStudent = () => {
    setStudents(prevStudents => prevStudents.filter(s => s.id !== currentStudent.id));
    setIsDeleteModalOpen(false);
    setCurrentStudent(null);
  };

  // Filter students based on search input
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>Mohai University</h2>
          <p>Student Management System</p>
        </div>
        <ul className="sidebar-menu">
          <li className="active">Dashboard</li>
          <li>Students</li>
          <li>Courses</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-navbar">
          <h1>Student Management System</h1>
          <div className="user-profile">
            <span>Admin User</span>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Students</h3>
              <p className="stat-number">{students.length}</p>
            </div>
            <div className="stat-card">
              <h3>Active Enrollments</h3>
              <p className="stat-number">{students.filter(s => s.status === 'Active').length}</p>
            </div>
            <div className="stat-card">
              <h3>Courses Offered</h3>
              <p className="stat-number">10</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="toolbar">
            <input
              type="text"
              placeholder="Search by name, ID, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              + Add New Student
            </button>
          </div>

          {/* Student Records Table */}
          <div className="table-container">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Age</th>
                  <th>Email</th>
                  <th>Course of Study</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.age}</td>
                      <td>{student.email}</td>
                      <td>{student.course}</td>
                      <td>
                        <span className={`badge ${student.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-action btn-edit" onClick={() => handleOpenEditModal(student)}>Edit</button>
                        <button className="btn-action btn-delete" onClick={() => handleOpenDeleteModal(student)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-records">No student records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ADD STUDENT MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Student</h2>
            {errorMsg && <div className="error-banner">{errorMsg}</div>}
            <form onSubmit={handleAddStudent}>
              <div className="form-group">
                <label>Student ID</label>
                <input
                  type="text"
                  placeholder="e.g. 901020666"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ntsane Makhoali"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  placeholder="e.g. 21"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="student@limkokwing.ac.ls"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Course of Study</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  <option value="Diploma in Information Technology">Diploma in Information Technology</option>
                  <option value="Diploma in Business Management">Diploma in Business Management</option>
                  <option value="Diploma in Accounting and Finance">Diploma in Accounting and Finance</option>
                  <option value="Diploma in Multimedia and Animation">Diploma in Multimedia and Animation</option>
                  <option value="Diploma in Software Engineering">Diploma in Software Engineering</option>
                  <option value="Diploma in Tourism and Hospitality Management">Diploma in Tourism and Hospitality Management</option>
                  <option value="Diploma in Human Resource Management">Diploma in Human Resource Management</option>
                  <option value="Diploma in Graphic Design">Diploma in Graphic Design</option>
                  <option value="Diploma in Network Security">Diploma in Network Security</option>
                  <option value="Diploma in Marketing">Diploma in Marketing</option>
                </select>
              </div>
              <div className="form-group">
                <label>Enrollment Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Student Record</h2>
            {errorMsg && <div className="error-banner">{errorMsg}</div>}
            <form onSubmit={handleUpdateStudent}>
              <div className="form-group">
                <label>Student ID</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Course of Study</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  <option value="Diploma in Information Technology">Diploma in Information Technology</option>
                  <option value="Diploma in Business Management">Diploma in Business Management</option>
                  <option value="Diploma in Accounting and Finance">Diploma in Accounting and Finance</option>
                  <option value="Diploma in Multimedia and Animation">Diploma in Multimedia and Animation</option>
                  <option value="Diploma in Software Engineering">Diploma in Software Engineering</option>
                  <option value="Diploma in Tourism and Hospitality Management">Diploma in Tourism and Hospitality Management</option>
                  <option value="Diploma in Human Resource Management">Diploma in Human Resource Management</option>
                  <option value="Diploma in Graphic Design">Diploma in Graphic Design</option>
                  <option value="Diploma in Network Security">Diploma in Network Security</option>
                  <option value="Diploma in Marketing">Diploma in Marketing</option>
                </select>
              </div>
              <div className="form-group">
                <label>Enrollment Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete record for <strong>{currentStudent?.name}</strong>?</p>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteStudent}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;