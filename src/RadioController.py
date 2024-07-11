import logging


logger = logging.getLogger(__name__)


class DummyRadioController:
    def init_radio(self):
        self.rig_type = "dummy"
        self.status_string = "I am a dummy"
        logger.info("Initializing radio")

    def set_mode(self, mode):
        logger.info(f"Setting mode: {mode}")

    def set_frequency(self, slot, freq):
        logger.info(f"Setting frequency: {freq} in slot {slot}")


class OmnirigRadioController:
    def __init__(self, port=8765, log_level=logging.DEBUG):
        self.server = None
        self.omni_client = None
        self.port = port
        self.log_level = log_level

    def init_radio(self):
        """initialize an omnipyrig instance and set active rig"""
        import omnipyrig
        self.omni_client = omnipyrig.OmniRigWrapper()
        # set the active rig to 1 (as defined in OmniRig GUI)
        self.omni_client.setActiveRig(1)
        self.rig_type = self.omni_client.getParam("RigType")
        self.status_string = self.omni_client.getParam("StatusStr")
        logger.debug(f"Rig type: {self.rig_type}, Status string: {self.status_string}")

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
