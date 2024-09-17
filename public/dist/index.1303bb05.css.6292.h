* {
  box-sizing: border-box;
  color: #3f3e41;
  background-color: #fff;
  margin: 0;
  padding: 0;
  font-family: Poppins, sans-serif;
  text-decoration: none;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

.popUp {
  z-index: 1000;
  visibility: hidden;
  background-color: #f6f6f6;
  border-radius: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 30%;
  padding: 2rem;
  transition: visibility .1s, transform .3s;
  display: flex;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)translateY(150px);
  box-shadow: 0 0 15px #0000001a;
}

.slideup {
  visibility: visible;
  transform: translate(-50%, -50%)translateY(0);
}

.fullname {
  grid-template-rows: auto auto;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
  gap: 1rem;
  display: grid;
}

.form {
  background-color: #f6f6f6;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  display: flex;
}

.popUp p, .popUp h3 {
  background-color: #f6f6f6;
  font-weight: 700;
}

.form div {
  background-color: #f6f6f6;
}

.fullname input, .form input {
  border: 1px solid #d3d3d3;
  border-radius: .3rem;
  outline: none;
  padding: .5rem;
}

.fullname input {
  width: 8rem;
}

.form input {
  width: 100%;
}

.required {
  color: red;
  background-color: #f6f6f6;
}

.signup-btn-confirm {
  color: #fff;
  background: linear-gradient(45deg, #6b2da8, #560eaac7);
  border: none;
  border-radius: .5rem;
  margin-top: 1rem;
  padding: .5rem;
  font-weight: 700;
}

.hidden {
  display: none;
}

.blurred {
  filter: blur(5px);
}

header {
  z-index: 100;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 12%;
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
}

.fa.fa-bars {
  display: none;
}

.navigation {
  justify-content: center;
  align-items: center;
  gap: 2rem;
  display: flex;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
}

.sublogo {
  color: #6b2da8;
}

nav {
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;
  display: flex;
}

nav a {
  border-bottom: 2px solid #0000;
  padding: .5rem 0;
  font-weight: 550;
  transition: all .3s;
}

nav a:hover {
  color: #6b2da8;
  border-bottom: 2px solid #6b2da8;
}

.user-register {
  gap: 1rem;
  font-weight: 550;
  display: flex;
}

.login-btn {
  background-color: #0000;
  border-radius: .5rem;
  padding: .5rem;
  transition: all .3s;
}

.login-btn:hover {
  background-color: #e2dfe3;
}

.signup-btn {
  color: #f1f1f1;
  background-color: #6b2da8;
  border: 2px solid #0000;
  border-radius: .5rem;
  padding: .4rem 1rem;
  transition: all .3s;
}

.signup-btn:hover {
  color: #6b2da8;
  background-color: #0000;
  border: 2px solid #6b2da8;
  transform: scale(1.05);
}

.main {
  width: 100%;
  height: 100vh;
  padding: 5rem 12%;
  display: flex;
}

.main-introduction {
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  width: 50%;
  height: 100%;
  display: flex;
}

.introduction-title {
  flex-direction: column;
  gap: .2rem;
  font-size: 1.5rem;
  display: flex;
}

.typing-effect {
  align-items: center;
  gap: 1rem;
  height: 2rem;
  display: flex;
}

.introduction-title span {
  color: #6b2da8;
  border: 1px solid #6b2da8;
  border-radius: 1rem;
  padding: .3rem;
  font-size: 2rem;
  font-weight: 700;
  display: inline-block;
}

.introduction-details {
  font-style: italic;
}

.introduction-btns {
  align-items: center;
  gap: 2rem;
  display: flex;
}

.get-started {
  color: #f1f1f1;
  background-color: #6b2da8;
  border: 2px solid #0000;
  border-radius: .5rem;
  padding: .5rem 2rem;
  font-weight: 600;
  transition: all .3s;
}

.get-started:hover {
  color: #6b2da8;
  background-color: #0000;
  border: 2px solid #6b2da8;
  transform: scale(1.05);
}

.learn-more {
  align-items: center;
  gap: .5rem;
  font-weight: 600;
  display: inline-flex;
}

.learn-more i {
  transition: margin-left .3s;
  display: inline-block;
}

.learn-more:hover i {
  margin-left: .5rem;
}

.img-container {
  width: 50%;
  height: 100%;
}

.introduction-img {
  width: 100%;
}

.fa-arrow-right {
  color: #6b2da8;
}

.statistics-section {
  background-color: #f8f8f8;
  justify-content: space-between;
  width: 100%;
  height: 25vh;
  padding: 3rem 12%;
  display: flex;
}

.statistics-section div {
  background-color: #f8f8f8;
  flex-direction: column;
  align-items: center;
  width: 20%;
  display: flex;
}

.statistics-section div h2 {
  color: #6b2da8;
  background-color: #f8f8f8;
}

.statistics-section div p {
  background-color: #f8f8f8;
}

.features-section {
  background: linear-gradient(45deg, #6b2da8, #53129e9d);
  width: 100%;
  height: 100vh;
}

@media (width <= 480px) {
  .navigation nav {
    display: none;
  }

  header {
    border-bottom: .5px solid #afafaf;
    padding: 1rem;
  }

  .fa.fa-bars {
    color: #3f3e41;
    display: flex;
  }

  .user-register {
    display: none;
  }

  .navigation {
    justify-content: center;
    align-items: center;
    width: 100%;
    display: flex;
  }

  .typing-effect {
    height: 5rem;
    display: block;
  }

  .main {
    padding: 1rem;
  }

  .main-introduction {
    width: 100%;
  }

  .introduction-title, .typed-text {
    font-size: 1.8rem;
  }

  .introduction-details {
    font-size: 1.2rem;
    line-height: 2rem;
  }

  .img-container {
    display: none;
  }

  .statistics-section {
    text-align: center;
    background-color: #f8f8f8;
    grid-template-rows: auto auto;
    grid-template-columns: repeat(2, 1fr);
    justify-content: center;
    align-items: center;
    gap: 1rem;
    width: 100%;
    height: auto;
    padding: 3rem 12%;
    display: grid;
  }

  .statistics-section div {
    background-color: #fff;
    border-radius: 8px;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 1rem;
    display: flex;
    box-shadow: 0 4px 8px #0000001a;
  }

  .statistics-section div h2 {
    color: #6b2da8;
    background-color: #fff;
    margin-bottom: .5rem;
    font-size: 1.5rem;
  }

  .statistics-section div p {
    color: #3f3e41;
    background-color: #fff;
    font-size: 1rem;
  }
}
/*# sourceMappingURL=index.1303bb05.css.map */
