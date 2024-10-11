# Building MSI
This is the basics for building an MSI file.
It's still very much WIP, so it might not work.

* On a windows machine with installed python, create a venv:
    `python -m venv venv`
* Enter the venv (I used cygwin, in another shell it'll be different):
    `source venv\bin\activate`
* Install the dependencies:
    `pip install .`
* Install pyinstaller:
    `pip install pyinstaller`
* Build exe file:
    `pyinstaller -n HolyCluster src/ClientSideServer.py`
* Build msi (Make sure wix and dotnet are installed):
    `wix build -o HolyCluster.msi HolyCluster.wxs`
