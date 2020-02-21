import SettingsModal from "flarum/components/SettingsModal";

export default class FormattingSettingsModal extends SettingsModal {
  className() {
    return "FormattingSettingsModal Modal--small";
  }

  title() {
    return app.translator.trans(
      "jjwind320-formatting.admin.formatting_settings.title"
    );
  }

  form() {
    return [
      <div className="Form-group">
        <label>
          {app.translator.trans(
            "jjwind320-formatting.admin.formatting_settings.enc_pacs_app_id"
          )}
        </label>
        <input
          className="FormControl"
          bidi={this.setting("jjwind320-ext-formatting.enc_pacs_app_id")}
        />
      </div>,

      <div className="Form-group">
        <label>
          {app.translator.trans(
            "jjwind320-formatting.admin.formatting_settings.enc_pacs_aes_key"
          )}
        </label>
        <input
          className="FormControl"
          bidi={this.setting("jjwind320-ext-formatting.enc_pacs_aes_key")}
        />
      </div>,

      <div className="Form-group">
        <label>
          {app.translator.trans(
            "jjwind320-formatting.admin.formatting_settings.enc_pacs_base_address"
          )}
        </label>
        <input
          className="FormControl"
          bidi={this.setting("jjwind320-ext-formatting.enc_pacs_base_address")}
        />
      </div>
    ];
  }
}
