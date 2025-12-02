import { b24 } from './handleBitrixAuth.js';

export async function createNewLead(leadData) {
    const client = b24.instance;
    // get the phone number form the lead data:
    const { leadname, leadPhone } = leadData;

    let contactId = null;

    // --- 1. Create Contact with Error Handling ---
    try {
        // first create the contact of the lead:
        const contactResult = await client.callMethod('crm.contact.add', {
            fields: {
                NAME: leadname,
                PHONE: [{ VALUE: ('+' + leadPhone), VALUE_TYPE: 'WORK' }],
            },
        });
        
        // Check if the result indicates success (Bitrix24 API success is usually 'result' existing)
        if (contactResult && contactResult._data && contactResult._data.result) {
            console.log('Contact creation successful:', contactResult);
            // get the id of the contact:
            contactId = contactResult._data.result;
        } else {
            // Handle cases where the API call succeeded but the action failed
            console.error('Contact creation failed with no ID returned:', contactResult);
            // Throw an error to stop further execution if contact creation is essential
            throw new Error('Bitrix24 contact creation failed or returned no ID.');
        }
    } catch (error) {
        console.error('Error during Bitrix24 Contact creation:', error.message || error);
        // Re-throw the error or return a status to the caller
        throw new Error(`Failed to create contact for lead: ${leadname}.`);
    }

    // Only proceed if a contact ID was successfully obtained
    if (contactId) {
        // --- 2. Create Lead with Error Handling ---
        try {
            // now create the lead and link it to the contact:
            const leadResult = await client.callMethod('crm.lead.add', {
                fields: {
                    TITLE: `${leadname}`,
                    CONTACT_ID: contactId, // Use CONTACT_ID field to link
                }
            });

            // Check if the result indicates success
            if (leadResult && leadResult._data && leadResult._data.result) {
                console.log('Lead creation successful:', leadResult);
                return leadResult._data.result; // Return the new Lead ID
            } else {
                console.error('Lead creation failed with no ID returned:', leadResult);
                throw new Error('Bitrix24 lead creation failed or returned no ID.');
            }

        } catch (error) {
            console.error('Error during Bitrix24 Lead creation:', error.message || error);
            throw new Error(`Failed to create lead for contact ID: ${contactId}.`);
        }
    }
}