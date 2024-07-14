<div align="center">

![icon](https://github.com/4Z1KD/HolyCluster/assets/24712835/9f4846ae-ac57-4169-9c6f-2c2b506707ab)

</div>

# HolyCluster 🌐

### An ongoing effort to create a visualization of the ham radio cluster

![image](https://github.com/4Z1KD/HolyCluster/assets/24712835/e50cbdb7-22a5-4142-a200-1548b975a692)

# Installation 🛠

1. create a virtual environment (https://docs.python.org/3/library/venv.html)
   ```bash
   python -m venv venv_HolyCluster
   ```
3. activate the venv:
* Windows: `\venv_HolyCluster\Scripts\activate.bat`
* Linux: `source venv_HolyCluster/bin/activate`
4. install the project (`-e` is for development mode):
```bash
pip install -e .
```

# Usage 💾
For now, the best way to run the application is to start the client side server:
```bash
uvicorn --reload ClientSideServer:app
```
For system without omnirig installed, execute:
```bash
DUMMY=1 uvicorn --reload ClientSideServer:app
```

Then, go to The main page at <http://localhost:8000/index.html>.

in the future it will be compiled into an executable 💾

# Progress 📈

since this is a work in progress, please expect poor performance, bugs, runtime issues and more.
