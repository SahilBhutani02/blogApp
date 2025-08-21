import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";
import { toast } from "sonner";

const Form = ({ route, method }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const name = method === "login" ? "Login" : "Sign Up";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data =
      method === "login"
        ? { username, password }
        : { username, email, password };

    try {
      const res = await api.post(route, data);
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
        toast.success("Login successful");
      } else {
        navigate("/login");
        toast.success("Account created! Please log in.");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.email ||
        error?.response?.data?.username ||
        error?.response?.data?.password ||
        error?.response?.data?.detail ||
        "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label>User Name</Label>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="dark:border-gray-600 dark:bg-gray-900"
        />
      </div>

      {method !== "login" && (
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Enter yor email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      )}
      <div className="relative">
        <Label>Password</Label>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="dark:border-gray-600 dark:bg-gray-900"
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : name}
      </Button>
    </form>
  );
};

export default Form;
