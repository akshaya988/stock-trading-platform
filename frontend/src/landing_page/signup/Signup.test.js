import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { redirectToDashboard } from "../../auth";
import Signup from "./Signup";

jest.mock("axios");
jest.mock("../../auth", () => ({
  API_URL: "http://localhost:3002",
  redirectToDashboard: jest.fn(),
}));

describe("Signup page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders required email and password fields", () => {
    render(<Signup />);

    expect(
      screen.getByRole("heading", { name: /start your investing journey today/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email address/i })).toBeRequired();
    expect(screen.getByLabelText(/password/i)).toHaveAttribute("minLength", "8");
    expect(
      screen.getByRole("heading", { name: /invest on your terms/i })
    ).toBeInTheDocument();
  });

  test("creates the account through the backend and redirects to the dashboard", async () => {
    axios.post.mockResolvedValue({ status: 201 });
    render(<Signup />);

    fireEvent.change(screen.getByRole("textbox", { name: /email address/i }), {
      target: { value: "investor@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secure-pass-123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3002/auth/signup",
        { name: "", email: "investor@example.com", password: "secure-pass-123" },
        { withCredentials: true }
      );
      expect(redirectToDashboard).toHaveBeenCalledTimes(1);
    });
  });

  test("shows account errors returned by the backend", async () => {
    axios.post.mockRejectedValue({
      response: { data: { error: "An account with this email already exists." } },
    });
    render(<Signup />);

    fireEvent.change(screen.getByRole("textbox", { name: /email address/i }), {
      target: { value: "investor@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secure-pass-123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /account with this email already exists/i
    );
  });
});
