// src/components/users/UserForm.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { roleService } from "../../services/roleService";
import { userService } from "../../services/userService";
import { Role } from "../../types/role.types";
import { UserFormData } from "../../types/user.types";

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    roleId: "",
    status: "active"
  });

  const isEditMode = id !== "new";

  useEffect(() => {
    // Fetch roles
    const fetchRoles = async () => {
      try {
        const rolesData = await roleService.getRoles();
        setRoles(rolesData);

        // Set default role if adding a new user
        if (!isEditMode && rolesData.length > 0) {
          setFormData((prev) => ({ ...prev, roleId: rolesData[0].id }));
        }
      } catch (err: any) {
        setError("Failed to fetch roles: " + err.message);
      }
    };

    fetchRoles();

    // If editing, fetch the user data
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const userData = await userService.getUserById(id as string);

          // Remove password field for editing
          const { password, ...userDataWithoutPassword } = userData;

          setFormData(userDataWithoutPassword as UserFormData);
        } catch (err: any) {
          setError("Failed to fetch user: " + err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditMode) {
        // Don't send empty password when updating
        const { password, ...updateData } = formData;
        if (password) {
          await userService.updateUser(id as string, formData);
        } else {
          await userService.updateUser(id as string, updateData);
        }
      } else {
        await userService.createUser(formData);
      }

      navigate("/users");
    } catch (err: any) {
      setError(
        `Failed to ${isEditMode ? "update" : "create"} user: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="flex justify-center py-6">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditMode ? "Edit User" : "Add New User"}
        </h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            {isEditMode ? "Password (leave blank to keep current)" : "Password"}
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required={!isEditMode}
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="roleId"
            className="block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            name="roleId"
            id="roleId"
            value={formData.roleId}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Saving..." : isEditMode ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
