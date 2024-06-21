import logging


class DummyRadioController:
    def init_radio(self):
        print("Initializing radio")

    def set_mode(self, mode):
        print(f"Setting mode: {mode}")

    def set_frequency(self, slot, freq):
        print(f"Setting frequency: {freq} in slot {slot}")


class OmnirigRadioController:
    def __init__(self, port=8765, log_level=logging.DEBUG):
        self.server = None
        self.omni_client = None
        self.port = port
        self.log_level = log_level

    def init_radio(self):
        '''initialize an omnipyrig instance and set active rig'''
        import omnipyrig
        self.omni_client = omnipyrig.OmniRigWrapper()
        # set the active rig to 1 (as defined in OmniRig GUI)
        self.omni_client.setActiveRig(1)
        self.rig_type = self.omni_client.getParam("RigType")
        self.status_string = self.omni_client.getParam("StatusStr")
        if self.log_level <= logging.INFO:
            print(f"RigType: {self.rig_type}")
            print(f"StatusStr: {self.status_string}")

    def set_mode(self, mode):
        mode_to_number = {
            "USB": 2,
            "LSB": 1,
            "FT8": 12,
            "CW": 3,
        }
        self.omni_client.setMode(mode_to_number[mode])

    def set_frequency(self, slot, freq):
        self.omni_client.setFrequency("A", freq)
