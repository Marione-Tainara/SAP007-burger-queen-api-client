import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { createUser } from "../services/api";
import Message from "../components/Message";
import { codeError } from "../services/error";
import { setToken } from "../services/token";
import Role from '../components/Role';
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const minLength = 6

  const location = useLocation();
  let feedback = " ";
  if (location.state) {
    feedback = location.state.feedback;
  }
  function handleSubmit(e) {
    e.preventDefault();
    createUser(name, email, password, role)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        setError(codeError(response));
      })
      .then((data) => {
        setToken(data.token);
        navigate(data.role === "hall" ? "/hall" : "/kitchen");
      })
      .catch((error) => console.log(error));
  }
  return (
    <div className="DivForm">
      <Logo />
      <form onSubmit={createUser}>
      <div className="DivRole">
        <Role
          type="radio"
          value="kitchen"
          name="role"
          id="kitchen"
          label="COZINHA"
          onChange={(e) => setRole(e.target.value)}
        />
        <Role
          type="radio"
          value="hall"
          name="role"
          id="hall"
          label="SALÃO"
          onChange={(e) => setRole(e.target.value)}
        />
      </div>
        <Input
          type="name"
          placeholder="NOME"
          value={name}
          id="name"
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="E-MAIL"
          value={email}
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="SENHA"
          value={password}
          id="password"
          name="password"
          minlength="6"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button children="CADASTRAR" onClick={handleSubmit} disable={password.length < minLength}/>
        <Link to="/login" className="Hiperlink">
          Já tenho cadastro
        </Link>
        {feedback && <Message msg={feedback} />}
        {error && <Message  msg={error} />}
      </form>
    </div>
  );
}
export default Register;