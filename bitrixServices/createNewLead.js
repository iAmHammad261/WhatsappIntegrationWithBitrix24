import { b24 } from './handleBitrixAuth.js';

export async function createNewLead(leadData) {
    const client = b24.instance;

    // get the phone number form the lead data:
    const {leadname, leadPhone} = leadData;

    // first create the contact of the lead:
    const contactResult = await client.callMethod('crm.contact.add', {
        fields: {
            NAME: leadname,
            PHONE: [{VALUE: leadPhone, VALUE_TYPE: 'WORK'}],
        },
    });

    console.log('Contact creation result:', contactResult);

    // get the id of the contact:
    const contactId = contactResult._data.result;

    // now create the lead and link it to the contact:
    const leadResult = await client.callMethod('crm.lead.add', {
        fields: {
            TITLE: `${leadname}`,
            crm_contact: contactId,
}})

console.log('Lead creation result:', leadResult);

}