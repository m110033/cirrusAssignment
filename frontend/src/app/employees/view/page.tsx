'use client';

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { checkAndRefreshToken, Employee, getEmployee, getEmployees, updateEmployee } from "@/components/api";

const ViewEmployeePage = () => {
  const router = useRouter();

  const searchParams = useSearchParams(); // Get query params

  const employeeId = searchParams.get("id") || ''; // Extract `id` parameter

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const [employee, setEmployee] = useState<Employee>();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState(""); // Tracks any error during submission

  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false); // Whether an option is selected

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        await checkAndRefreshToken(); // Check token before making API calls
        const response = await getEmployee(employeeId);

        setFormData((prev) => ({
          ...prev,
          email: response.email,
          username: response.username,
          role: response.role,
        }));

        setEmployee(response);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployee();
  }, []);
  
  // Handles changes to input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Update form data state
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Update Employee" />
      <div className="flex flex-col gap-10">
        {/* Employee Form */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Employee Form</h3>
          </div>
          <div className="p-6.5">
            {/* Email Field */}
            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                defaultValue={employee?.email}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-transparent disabled:text-black dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                disabled
              />
            </div>

            {/* Username Field */}
            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                defaultValue={employee?.username}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-transparent disabled:text-black dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                disabled
              />
            </div>

            {/* Role Dropdown */}
            {userInfo?.role === "admin" && (
            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Role
              </label>
              <input
                name="role"
                value={formData.role === "admin" ? "Admin" : "Employee"}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-transparent disabled:text-black dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                disabled
              />
            </div>
            )}

            {/* Error Message */}
            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ViewEmployeePage;