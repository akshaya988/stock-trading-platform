import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { redirectToDashboard } from "../../auth";
import Login from "./Login";

jest.mock("axios");
jest.mock("../../auth", () => ({
  API_URL: "http://localhost:3002",
  redirectToDashboard: jest.fn(),
}));

describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("authenticates through the backend and redirects to the dashboard", async () => {
    axios.post.mockResolvedValue({ status: 200 });
    render(<Login />);

    fireEvent.change(screen.getByRole("textbox", { name: /email address/i }), {
      target: { value: "investor@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secure-pass-123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3002/auth/login",
        { email: "investor@example.com", password: "secure-pass-123" },
        { withCredentials: true }
      );
      expect(redirectToDashboard).toHaveBeenCalledTimes(1);
    });
  });

  test("shows invalid credentials from the backend", async () => {
    axios.post.mockRejectedValue({
      response: { data: { error: "Email or password is incorrect." } },
    });
    render(<Login />);

    fireEvent.change(screen.getByRole("textbox", { name: /email address/i }), {
      target: { value: "investor@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /email or password is incorrect/i
    );
  });
});
