function getElement(id){
    return document.getElementById(id);
}
getElement("signin-btn").addEventListener("click", (e)=>{
    e.preventDefault();
    const userName = getElement("user-name-input").value;
    const password = getElement("pass-input").value;
    if(userName === "admin" && password === "admin123"){
        alert("login Successfull");
        window.location.href = "../home.html"
    }else{
        alert("login credentials invalid")
        return;
    }
    })