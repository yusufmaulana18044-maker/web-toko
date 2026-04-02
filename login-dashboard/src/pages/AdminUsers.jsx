import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminUsers.css";

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token || user.role !== "admin") {
      navigate("/");
    }
  }, [token, user.role, navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Use /users endpoint instead (no auth needed, works reliably)
      const res = await fetch("http://localhost:5000/users");

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      if (data.success) {
        setUsers(data.data || []);
      } else if (Array.isArray(data.data)) {
        setUsers(data.data);
      } else if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError(data.message || "Gagal load users");
        setUsers([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Gagal load users: " + err.message);
      setUsers([]);
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) {
      setError("Pilih user dan role terlebih dahulu");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/auth/update-role", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: parseInt(selectedUser),
          role: selectedRole
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setSuccess("Role berhasil diubah");
        setSelectedUser("");
        setSelectedRole("");
        await fetchUsers();
      } else {
        setError(data.message || "Gagal mengubah role");
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`http://localhost:5000/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setSuccess("User berhasil dihapus");
        await fetchUsers();
      } else {
        setError(data.message || "Gagal menghapus user");
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-users">
      <h2>👥 Manajemen Users</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="role-update-section">
        <h3>Ubah Role User</h3>
        <div className="role-form">
          <div className="form-group">
            <label>Pilih User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">-- Pilih User --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Pilih Role Baru</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">-- Pilih Role --</option>
              <option value="user">User</option>
              <option value="kasir">Kasir</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={handleUpdateRole}>
            Update Role
          </button>
        </div>
      </div>

      <div className="users-table">
        <h3>Daftar Users</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Nama Lengkap</th>
              <th>No Telepon</th>
              <th>Role</th>
              <th>Dibuat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.full_name}</td>
                <td>{u.phone || "-"}</td>
                <td>
                  <span className={`role-badge role-${u.role}`}>
                    {u.role}
                  </span>
                </td>
                <td>{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteUser(u.id)}
                    disabled={u.id === user.id}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
