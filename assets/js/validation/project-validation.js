const NUMBER_PATTERN = /^[A-Z0-9][A-Z0-9-]{2,29}$/;

export function normalizeProjectForm(formData) {
  return {
    project_number: String(formData.get("project_number") || "").trim().toUpperCase(),
    name: String(formData.get("name") || "").trim(), customer_id: String(formData.get("customer_id") || ""),
    branch_id: String(formData.get("branch_id") || ""), status: String(formData.get("status") || "draft"),
    start_date: String(formData.get("start_date") || "") || null,
    expected_completion_date: String(formData.get("expected_completion_date") || "") || null,
    completed_date: String(formData.get("completed_date") || "") || null,
    default_currency_code: String(formData.get("default_currency_code") || "PKR"),
    project_manager_id: String(formData.get("project_manager_id") || "") || null,
    description: String(formData.get("description") || "").trim() || null,
    service_type_ids: formData.getAll("service_type_ids").map(String),
    primary_service_type_id: String(formData.get("primary_service_type_id") || "") || null
  };
}

export function validateProject(project) {
  const errors = {};
  if (!NUMBER_PATTERN.test(project.project_number)) errors.project_number = "Use 3–30 uppercase letters, numbers or hyphens.";
  if (project.name.length < 2 || project.name.length > 160) errors.name = "Enter a project name between 2 and 160 characters.";
  if (!project.customer_id) errors.customer_id = "Select a customer.";
  if (!project.branch_id) errors.branch_id = "Select a branch.";
  if (!project.service_type_ids.length) errors.service_type_ids = "Select at least one service.";
  if (!project.primary_service_type_id || !project.service_type_ids.includes(project.primary_service_type_id)) errors.primary_service_type_id = "Choose a primary service from the selected services.";
  if (project.start_date && project.expected_completion_date && project.expected_completion_date < project.start_date) errors.expected_completion_date = "Expected completion cannot be before the start date.";
  if (project.status === "completed" && !project.completed_date) errors.completed_date = "Enter the completion date for a completed project.";
  if (project.completed_date && project.start_date && project.completed_date < project.start_date) errors.completed_date = "Completion cannot be before the start date.";
  return errors;
}
