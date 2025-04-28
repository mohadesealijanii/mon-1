import { useState } from "react";
import { PropagateLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import logo from "../../../pics/logo.png";
import study from "../../../pics/study.png";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

function SigninPage() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("please enter your username and password");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        "https://stg-core.bpapp.net/api/Member/AdminLogin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            password,
            rememberMe: true,
            confirmed: true,
          }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (!data.token) {
        setPassword("");
        setUsername("");
        throw new Error(data.errors);
      }

      Cookies.set("authToken", data.token, { expires: 7, path: "/" });
      localStorage.setItem("loginTime", Date.now()); 

      toast.success("you logged in successfully");
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="-mt-15 flex min-h-screen justify-center items-center">
        <div className="md:flex sm:flex lg:w-auto md:w-auto w-full sm:rounded-3xl lg:rounded-3xl md:rounded-3xl shadow-lg bg-white">
          <img
            src={study}
            alt="study"
            className="h-120 rounded-l-3xl hidden md:block sm:block lg:block bg-white"
          />
          <div className="p-3 md:w-96 mx-auto">
            <form
              noValidate
              onSubmit={handleLogin}
              className="flex flex-col justify-center"
            >
              <div className="flex justify-center">
                <img
                  src={logo}
                  alt="logo"
                  className="lg:w-17 md:w-17 w-13 h-auto"
                />
              </div>
              <h3 className="font-bold mt-10 mb-5 text-center">
                welcome back!
              </h3>
              <div className="flex flex-col">
                <input
                  placeholder="phone or email"
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  value={username}
                  className="text-xs w-full text-gray-800 border border-gray-300 pl-4 pr-10 py-3 rounded-xl outline-ocean mb-2"
                  required
                />
                <div>
                  <input
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    value={password}
                    className="text-xs w-full text-gray-800 border border-gray-300 pl-4 pr-10 py-3 rounded-xl outline-ocean"
                    required
                  />
                </div>
              </div>

              <Link
                to="/forgetPass"
                className="text-ocean mt-3 text-sm pl-1 mb-5"
              >
                Forgot password?
              </Link>

              <button
                type="submit"
                className="bg-ocean rounded-xl py-3 text-white mt-9 mb-3 text-sm"
              >
                {loading ? (
                  <p>
                    <PropagateLoader
                      color="white"
                      className="content-center -mt-2 h-7"
                    />
                  </p>
                ) : (
                  <p>sign in</p>
                )}
              </button>
            </form>
            <Toaster />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SigninPage;
