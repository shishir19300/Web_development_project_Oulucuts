const signupForm = document.getElementById('signup-form');
const errorMsg   = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');

signupForm.addEventListener('submit', async (event) => {
    
    event.preventDefault();
const username = document.getElementById('signup-username').value.trim(); 
const password = document.getElementById('signup-password').value;
const age      = document.getElementById('signup-age').value;
const genderElement = document.querySelector('input[name="gender"]:checked');
const gender = genderElement ? genderElement.value : '';

errorMsg.style.display   = 'none';
successMsg.style.display = 'none';

if(!username || !password || !gender || !age){
    errorMsg.textContent = 'Fill all the fields';
    errorMsg.style.display = 'block';
    return
}
try {
    const response = await fetch(`${CONFIG.API_BASE}/api/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({name:username, username, password, gender, age: parseInt(age) })
    });
    const data = await response.json();

    if(response.ok) { 
    successMsg.textContent   = '✅ Account created! Redirecting...';
    successMsg.style.display = 'block'; 
    setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
    } else{
        errorMsg.textContent = data.error;
        errorMsg.style.display = 'block';
    }
    } catch (err) {
    errorMsg.textContent   = ' Server is offline!';
    errorMsg.style.display = 'block';
  }
});
