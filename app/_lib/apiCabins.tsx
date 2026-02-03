import { eachDayOfInterval, set } from 'date-fns';
import supabase, { gql } from './superbase';
import { notFound } from 'next/navigation';

interface Cabin {
    id: string;
    name: string;
    maxCapacity: number;
    regularPrice: number;
    discount: number;
    image: string;
    description: string;
}

type NewGuest = {
    email: string;
    fullName: string;
    nationalID?: string;
    nationality?: string;
    countryFlag?: string;
}

function unwrap<T>(collection: { edges: { node: T }[] }) {
    return collection.edges.map(e => e.node);
}

function unwrapOne<T>(collection: { edges: { node: T }[] }) {
    return collection.edges[0]?.node ?? null;
}


export async function getCabin(id: string): Promise<Cabin> {
    const data = await gql<{
        cabinsCollection: {
            edges: { node: Cabin }[];
        };
    }>(` query GetCabin($id: UUID!) {
      cabinsCollection(
        filter: { id: { eq: $id } }
      ) {
        edges {
          node {
            id
            name
            maxCapacity
            regularPrice
            discount
            image
            description
          }
        }
      }
    }
  `, { id }
    );

    const cabin = unwrapOne(data.cabinsCollection);
    if (!cabin) {
        notFound();
    }
    return cabin;
}

export async function getCabins() {
    const data = await gql<{
        cabinsCollection: {
            edges: { node: Cabin }[];
        };
    }>(`
    query {
      cabinsCollection(
        orderBy: [{ name: AscNullsLast }]
      ) {
        edges {
          node {
            id
            name
            maxCapacity
            regularPrice
            discount
            image
          }
        }
      }
    }
  `);

    return unwrap(data.cabinsCollection);
}

export async function getCabinPrice(id: string) {
    const { data, error } = await supabase
        .from('cabins')
        .select('regularPrice, discount')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
        notFound();
    }

    return data;
}


export async function getGuest(email: string) {
    const data = await gql<{
        guestsCollection: {
            edges: { node: any }[];
        };
    }>(`
    query GetGuest($email: String!) {
      guestsCollection(filter: { email: { eq: $email } }) {
        edges {
          node {
            id
            email
            fullName
            nationalID
            nationality
            countryFlag
          }
        }
      }
    }
  `, { email });

    return unwrapOne(data.guestsCollection);
}

export async function getBooking(id: string) {
    const data = await gql<{
        bookingsCollection: {
            edges: { node: any }[];
        };
    }>(
        `
    query GetBooking($id: UUID!) {
      bookingsCollection(filter: { id: { eq: $id } }) {
        edges {
          node {
            id
            startDate
            endDate
            status
            cabinId
            # Accessing the related cabin record
            cabin {
              id
              name
              regularPrice
              discount
            }
            # Accessing the related guest record
            guests {
              id
              email
              fullName
            }
          }
        }
      }
    }
    `,
        { id }
    );

    const booking = unwrapOne(data?.bookingsCollection);

    if (!booking) {
        throw new Error('Booking could not be loaded');
    }

    return {
        ...booking,
        cabins: unwrapOne(booking.cabins),
        guests: unwrapOne(booking.guests),
    };
}


export async function getBookings(guestId: string) {
    const data = await gql<{
        bookingsCollection: {
            edges: { node: any }[];
        };
    }>(
        `
    query GetBookings($guestId: UUID!) {
      bookingsCollection(
        filter: { guestId: { eq: $guestId } }
        orderBy: [{ startDate: AscNullsLast }]
      ) {
        edges {
          node {
            id
            numNigths
            hasBreakfast
            observations
            totalPrice
            numGuests
            startDate
            endDate
            status
            created_at
            cabin {
              name
              image
            }
          }
        }
      }
    }
    `,
        { guestId }
    );

    return unwrap(data?.bookingsCollection) ?? [];
}


export async function getBookedDatesByCabinId(cabinId: string) {
    const today = new Date().toISOString();

    const data = await gql<{
        bookingsCollection: {
            edges: { node: { startDate: string; endDate: string } }[];
        };
    }>(`
    query GetBookedDates($cabinId: UUID!, $today: Datetime!) {
      bookingsCollection(
        filter: {
          cabinId: { eq: $cabinId }
          or: [
            { startDate: { gte: $today } },
            { status: { eq: "checked-in" } }
          ]
        }
      ) {
        edges {
          node {
            startDate
            endDate
          }
        }
      }
    }
  `, { cabinId, today });

    const bookings = unwrap(data.bookingsCollection);

    const bookedDates = bookings
        .map((booking) => {
            return eachDayOfInterval({
                start: new Date(booking.startDate),
                end: new Date(booking.endDate),
            });
        })
        .flat();

    return bookedDates;
}

export async function getSettings() {
    const data = await gql<{
        settingsCollection: {
            edges: { node: any }[];
        };
    }>(`
    query GetSettings {
      settingsCollection {
        edges {
          node {
            minBookingLength
            maxBookingLength
            maxGuestBooking
            breakfastPrice
          }
        }
      }
    }
  `);

    const settings = unwrapOne(data.settingsCollection);
    if (!settings) throw new Error('Settings could not be loaded');

    return settings;
}

export async function getCountries() {
    try {
        const res = await fetch(
            'https://restcountries.com/v2/all?fields=name,flag'
        );
        const countries = await res.json();
        return countries;
    } catch {
        throw new Error('Could not fetch countries');
    }
}

export async function createGuest(newGuest: NewGuest) {
    const data = await gql<{
        insertIntoguestsCollection: {
            records: any[];
        }
    }>(`
        mutation CreateGuest($objects: [guestInsertInput!]!) {
        insertIntoguestsCollection(objects: $objects) {
                records {
                    id
                    email
                    fullName
                    nationalID
                    nationality
                    countryFlag
                }
            }
        }
        `,
        { objects: [newGuest] });
    return data.insertIntoguestsCollection.records[0];
}

export async function createBooking(newBooking: any) {
    const data = await gql<{
        insert_bookings_one: any;
    }>(
        `
    mutation CreateBooking($booking: bookings_insert_input!) {
      insert_bookings_one(object: $booking) {
        id
        startDate
        endDate
        status
      }
    }
    `,
        { booking: newBooking }
    );

    return data.insert_bookings_one;
}


// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id: string, updatedFields: unknown) {
    const data = await gql<{
        updateguestsCollection: {
            records: any[];
        };
    }>(
        `
    mutation UpdateGuest($set: questUpdateInput!, $filter: guestFilter!) {
      updateguestsCollection(
        set: $set
        filter: $filter
      ) {
        records {
            nationalID
            nationality
            countryFlag
        }
      }
    }
    `,
        {
            set: updatedFields,
            filter: { id: { eq: id } },
        }
    );

    return data.updateguestsCollection.records[0];
}

export async function updateBooking(id: string, updatedFields: any) {
    const data = await gql<{
        update_bookings_by_pk: any;
    }>(
        `
    mutation UpdateBooking($id: UUID!, $changes: bookings_set_input!) {
      update_bookings_by_pk(
        pk_columns: { id: $id }
        _set: $changes
      ) {
        id
        status
      }
    }
    `,
        { id, changes: updatedFields }
    );

    return data.update_bookings_by_pk;
}


export async function deleteBooking(id: string) {
    const data = await gql<{
        deleteFrombookingsCollection: {
            records: { id: string }[];
        };
    }>(
        `
    mutation DeleteBooking($filter: bookingsFilter!) {
        deleteFrombookingsCollection(filter: $filter) {
            records {
            id
            }
        }
    }
    `,
        { filter: { id: { eq: id } } }
    );
    return data.deleteFrombookingsCollection;
}

