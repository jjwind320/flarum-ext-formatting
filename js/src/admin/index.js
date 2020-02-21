import app from "flarum/app";

import FormattingSettingsModal from "./components/FormattingSettingsModal";

app.initializers.add("jjwind320-formatting", () => {
  app.extensionSettings["jjwind320-formatting"] = () =>
    app.modal.show(new FormattingSettingsModal());
});
