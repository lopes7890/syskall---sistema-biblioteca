// Mostrar/ocultar senha
function togglePassword() {
  const pwInput = document.getElementById("password");
  const pwIcon = document.getElementById("pw-icon");

  if (pwInput.type === "password") {
    pwInput.type = "text";
    pwIcon.textContent = "visibility_off";
  } else {
    pwInput.type = "password";
    pwIcon.textContent = "visibility";
  }
}

// Validação visual simples
const inputs = document.querySelectorAll("input[required]");
inputs.forEach((input) => {
  input.addEventListener("blur", () => {
    if (input.value && input.checkValidity()) {
      input.classList.remove("border-outline-variant", "border-error");
      input.classList.add("border-secondary");
    } else if (input.value && !input.checkValidity()) {
      input.classList.remove("border-outline-variant", "border-secondary");
      input.classList.add("border-error");
    }
  });
});

// LOGIN
async function doLogin() {
  const btn = document.querySelector(".btn-primary");
  const originalText = btn.innerHTML;

  const email = document.getElementById("email").value;
  const password_user = document.getElementById("password").value;
  const message = document.getElementById("message");

  // validação básica
  if (!email || !password_user) {
    message.textContent = "Preencha email e senha.";
    return;
  }

  btn.innerHTML =
    '<span class="material-symbols-outlined animate-spin">progress_activity</span> Entrando...';
  btn.disabled = true;

  try {
    const response = await fetch(
      "https://api-alunos-syscall.onrender.com/login/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password_user,
        }),
      }
    );

    // tenta ler resposta com segurança
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Resposta da API não é JSON válido.");
    }

    if (response.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "painel.html";
    } else {
      message.textContent = data.message || "Email ou senha inválidos.";
    }
  } catch (error) {
    console.error(error);
    message.textContent = "Erro ao conectar com o servidor.";
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}