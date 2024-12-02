# HolyCluster <img src="https://github.com/4Z1KD/HolyCluster/assets/24712835/9f4846ae-ac57-4169-9c6f-2c2b506707ab" height="40px">

### An ongoing effort to visualize the ham radio cluster

## Prerequisites ⚙️

* A computer running Linux, macOS, or Windows
* `git`
* `python3`
* `node`, `npm`

## Installation 🛠

1. Clone the repository and enter its directory
    ```bash
    git clone https://github.com/4Z1KD/HolyCluster
    cd HolyCluster
    ```
2. Create a virtual environment (https://docs.python.org/3/library/venv.html)
    ```bash
    python -m venv venv_HolyCluster
    ```
3. Activate the virtual environment
    * Windows: `.\venv_HolyCluster\Scripts\activate.bat`
    * Linux and macOS: `source venv_HolyCluster/bin/activate`
4. Install the project (`-e` is for development mode)
    ```bash
    pip install -e '.[omnirig]'
    ```
    For linux systems, install without omnirig:
    ```bash
    pip install -e .
    ```
5. Build the frontend
    ```bash
    cd ui
    npm install
    npm run build
    ```

To deactivate the virtual environment, run `deactivate`.

## Usage 💾

For developing frontend related features:
```bash
cd ui
npm run dev
```

For development of CAT control related features, execute in the virtualenv:
```bash
python src/ClientSideServer.py
```

For systems without `omnirig` installed, execute
```bash
DUMMY=1 python src/ClientSideServer.py
```

In the future, the application will be compiled into an executable 💾

## Progress 📈

Since this project is a work in progress, you may experience poor performance, bugs, runtime issues, and maybe more.
We are working on fixing these issues.
