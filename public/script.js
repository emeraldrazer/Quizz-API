function SendBTN() {
    var currentPath = window.location.pathname;
    var pathSegments = currentPath.split('/');
    var token = pathSegments[pathSegments.length - 1];

    console.log(token);

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const formData = {
        newPassword: password,
    };

    fetch(`/api/v1/password-reset/${token}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (response.ok) {
                alert('Password reset successfully');
            } else {
                throw new Error('Error resetting password');
            }
        })
        .catch(error => {
            alert('Error resetting password');
            console.error(error);
        });
}