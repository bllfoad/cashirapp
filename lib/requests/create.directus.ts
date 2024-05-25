'use server';
import {directus} from "../directus/directus";
import {createItem } from "@directus/sdk"

export const createEmailSubscriber = async (email : string) => {

    try {
        await directus.request(
            createItem("news_letter",
             {email}
            ));
    }
    catch (error) {
        throw error;
    }
}

export const createContactForm = async (name : string, email : string, phone : string, subject : string, message : string) => {

    try {
        await directus.request(createItem("contact_form", {name, email,phone,subject, message}));
    }
    catch (error) {
        throw error;
    }
}