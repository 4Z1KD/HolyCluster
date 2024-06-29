![icon](https://github.com/4Z1KD/HolyCluster/assets/24712835/9f4846ae-ac57-4169-9c6f-2c2b506707ab)

# HolyCluster 🌐
This is an ongoing effort to create a visualization of the ham radio cluster<br>
![image](https://github.com/4Z1KD/HolyCluster/assets/24712835/e50cbdb7-22a5-4142-a200-1548b975a692)
<br>
# Installation 🛠
1. create a virtual environment (https://docs.python.org/3/library/venv.html) <br>
   ```bash
   python -m venv venv_HolyCluster
   ```
3. activate the venv:<br>
* Windows: `\venv_HolyCluster\Scripts\activate.bat`<br>
* Linux: `source venv_HolyCluster/bin/activate`<br>
4. install the project (`-e` is for development mode):
```bash
pip install -e .
``` 
<br>

# usage 💾
For now, the best way to run the application is to start the client side server:
```bash
uvicorn --reload ClientSideServer:app
```
For system without omnirig installed, execute:
```bash
DUMMY=1 uvicorn --reload ClientSideServer:app
```

Then, go to The main page at <http://localhost:8000/index.html>.

in the future it will be compiled into an executable 💾<br>
<br>

# progress 📈
since this is a work in progress, please expect poor performance, bugs, runtime issues and more.<br>
