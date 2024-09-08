import {FormGroup, NgForm, NgModel} from "@angular/forms";
import {AlertController} from "@ionic/angular";

export class Constants {
  public static noServiceError='Our services are currently offline or your have no internet access, Please try again later';
  static numPrizeBoxes = 6;
  static showInvalidControls(alertCtrl: AlertController, ctrls: NgModel[]) {

    const invalidControls = [];
    ctrls.forEach((c)=>{
      if(c.invalid)
      {
        invalidControls.push(c);
      }
    })
    if (invalidControls) {
      invalidControls.forEach((ctrl) => {
        if (ctrl instanceof FormGroup) {
          const tempGroup = ctrl as FormGroup;
          for (const control in tempGroup.controls) {
            tempGroup.controls[control].markAsTouched();
          }
        }
        ctrl.control.markAsTouched();
      });
    }
    alertCtrl
      .create({
        header: 'Incorrect Values',
        message:
          'The form is not correctly filled out, please check the form for details.',
        buttons: [
          {
            text: 'Okay',
            role: 'cancel',
          },
        ],
      })
      .then((alertEL) => alertEL.present());
  }

  public static popiDisclaimer=
    '<div>\n' +
    '    <h3>POPI Disclaimer</h3>\n' +
    '    <h4><strong>PromoForce</strong>  and the POPI Act</h4>\n' +
    '    <p>Welcome to a <strong>PromoForce</strong> survey site.</p>\n' +
    '    <p>When you make use of a <strong>PromoForce</strong> survey site, to give feedback and/or take part in competition(s) carried out through <strong>PromoForce</strong> platform(s) and provide us with <strong>personal information</strong>  which may be required, we process your <strong>personal information</strong>.</p>\n' +
    '    <p>The POPI Act (Protection of Personal Information Act) states that whenever we <strong>process</strong> your <strong>personal information</strong> when you use the PromoForce survey sites or any of <strong>PromoForce</strong> platforms whereby <strong>personal information</strong> may be <strong>processed, PromoForce</strong> is obliged to:</p>\n' +
    '    <ul>\n' +
    '        <li><p>Inform you of your rights & responsibilities regarding <strong>PromoForce’s processing</strong> of your <strong>personal information</strong>.</p></li>\n' +
    '        <li><p>Inform you of our rights and responsibilities when <strong>PromoForce processes</strong> your <strong>personal information</strong>; and</p></li>\n' +
    '        <li><p>Inform you of <strong>PromoForce</strong> responsibility to ask for your <strong>consent</strong> for <strong>PromoForce</strong> to <strong>process</strong> your <strong>personal information</strong>.</p></li>\n' +
    '    </ul>\n' +
    '    <p>The important terms to understand here are the following:</p>\n' +
    '    <p><strong>“Consent”</strong> means that you of your own accord provide us with your approval to process your personal information.</p>\n' +
    '    <p><strong>“Personal Information”</strong> means information that identifies or relates specifically to you, for example, your name, age, gender, identity number and contact details.</p>\n' +
    '    <p><strong>“Process-, Processing- or Processes”</strong> of personal information describes when <strong>PromoForce</strong> collects, received, records, organises, collates, stores, updates, modifies, retrieves, alters or use your personal information.</p>\n' +
    '    <p><strong>“Information Officer”</strong> means <strong>PromoForce</strong> delegates a trained and authorized personnel to process your personal information as per required by the POPI Act.</p>\n' +
    '    <p><i>** For full definition descriptions of the above terms please see clause 1 Definitions of the POPI Act and others clauses as may be applicable (POPI Act @ <a href="www.gov.za/documents/acts">www.gov.za/documents/acts</a>).</i></p>\n' +
    '    <p><strong>PromoForce</strong> will take all essential and secure means to protect the personal information of its users and to adhere with the requirements of processing of such personal information.</p>\n' +
    '    <p>By viewing this “Insert Form of Communication” you hereby acknowledge that you (the User) have read and accept the following Protection of Personal Information Act (POPIA) disclaimer and consent to <strong>PromoForce’s</strong> “use” and or “processing” of your personal information as prescribed by POPIA. Please also see requirements aligning hereto as per the Promotion of Access to Information Act (PAIA) – <i>(Please see PAIA @ <a href="www.gov.za/documents/acts">www.gov.za/documents/acts</a>)</i>.</p>\n' +
    '    <p><strong>PromoForce</strong> processes the User’s personal information primarily for <strong>PromoForce’s</strong> business purposes, which may include, but are not limited to:</p>\n' +
    '    <ol>\n' +
    '        <li><p>To communicate requested information to the User</p></li>\n' +
    '        <li><p>To provide services to the User as requested by the User</p></li>\n' +
    '        <li><p>To authenticate the User</p></li>\n' +
    '    </ol>\n' +
    '    <p>The personal information that <strong>PromoForce</strong> processes is stored in databases that have built-in safeguards to ensure the privacy and confidentiality of its users.</p>\n' +
    '    <p>That <strong>PromoForce</strong> accepts no liability whatsoever for any loss, damage (whether direct, indirect, special or consequential) and/or expenses of any nature whatsoever which may arise as a result of, or which may be attributable directly or indirectly from information made available on these pages or links, or actions or transaction resulting therefrom.</p>\n' +
    '    <p>The User, by accessing and or viewing the <strong>PromoForce</strong> survey site, hereby agree and consent to <strong>PromoForce’s</strong> use and process of my personal information as stated herein. The consent herein is extended to any personal information provided by me of 3rd parties, including but not limited to my spouse and or partner, minor child or any other person or entity, and I confirm that I have authorised consent from such 3rd parties to have access to – and to provide such 3rd party’s personal information to <strong>PromoForce</strong> and that <strong>PromoForce</strong> may use and process such personal information.</p>\n' +
    '</div>\n' ;

}
