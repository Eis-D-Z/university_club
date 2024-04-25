module university_club::club {
    use sui::clock::{Self, Clock};
    use sui::dynamic_object_field as dof;
    use sui::display;
    use sui::package::{Self, Publisher};
    use sui::table::{Self, Table};

    use std::string::{Self, String};


    const EOnlyPresidentCanAddNewMember: u64 = 0;
    const EOnlyPresidentCanCreateDisplay: u64 = 1;
    const EOnlyPresidentFunction: u64 = 2;
    const ECheckin10MinsBeforeAfter: u64 = 3;

    // OTW
    public struct CLUB has drop {}

    public struct Config has key {
        id: UID,
        publisher: Publisher
    }
    // shared
    public struct Club<phantom T> has key {
        id: UID,
        name: String,
        // address: user address, String: club position, eg president, vice-president ...
        members: Table<address, String>,
        next_meeting_name: String,
        next_meeting_time: u64
    }

    // nft implying Club Membership
    public struct ClubMember<phantom T> has key {
        id: UID,
        position: String,
        image_url: String,
        created_at: u64, // timestamp
        // meeting name - checkin time
        meetings_attended: Table<String, u64>
    }


    fun init(otw: CLUB, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);

        let config = Config {
            id: object::new(ctx),
            publisher
        };

        transfer::share_object(config);
    }


    // President functions


    public fun new_club<T>(name: String, clock: &Clock, image_url: String, ctx: &mut TxContext) {
        let president = ctx.sender();
        let mut members = table::new<address, String>(ctx);
        members.add<address, String>(president, string::utf8(b"President"));
        let club = Club<T> {
            id: object::new(ctx),
            name,
            members,
            next_meeting_name: string::utf8(b""),
            next_meeting_time: 0
        };

        let nft = ClubMember<T> {
            id: object::new(ctx),
            position: string::utf8(b"President"),
            image_url,
            created_at: clock::timestamp_ms(clock),
            meetings_attended: table::new<String, u64>(ctx)
        };
        transfer::transfer(nft, president);
        transfer::share_object(club);
    }

    public fun new_member<T>(
        club: &mut Club<T>,
        clock:&Clock,
        member: address,
        position: String,
        image_url: String,
        ctx: &mut TxContext)
    {
        // only president can add new members
        assert!(club.members.borrow(ctx.sender()) == &string::utf8(b"President"), EOnlyPresidentCanAddNewMember);
        club.members.add<address, String>(member, position);

        let nft = ClubMember<T> {
            id: object::new(ctx),
            position,
            image_url,
            created_at: clock::timestamp_ms(clock),
            meetings_attended: table::new<String, u64>(ctx)
        };

        transfer::transfer(nft, member);
    }

    public fun add_new_meeting<T>(club: &mut Club<T>, meeting_name: String, meeting_time: u64, ctx: &mut TxContext) {
        assert!(club.members.borrow(ctx.sender()) == &string::utf8(b"President"), EOnlyPresidentFunction);
        // can assert that meeting time is in the future
        club.next_meeting_name = meeting_name;
        club.next_meeting_time = meeting_time;
    }


    // Member Functions

    public fun prove_attendance<T>(club: &mut Club<T>, member: &mut ClubMember<T>, clock: &Clock) {
        let time = clock.timestamp_ms();
        let mut df = 0;
        if (time > club.next_meeting_time) {
            df = time - club.next_meeting_time;
        } else {
            df = club.next_meeting_time - time;
        };
        // We only allow members to come 10 mins earlier or later.
        assert!(df < 600001, ECheckin10MinsBeforeAfter);
        member.meetings_attended.add<String, u64>(club.next_meeting_name, time);
    }

    // ACC shouldn't be a generic type, we should create an Accessories type in another module.
    // This allows members to edit the image of the NFT which is a potential vulnerability.
    public fun add_accessory<T, ACC: key + store> (
        memberNFT: &mut ClubMember<T>,
        accessory: ACC,
        new_image_url: String
    ) {
        dof::add<ID, ACC>(&mut memberNFT.id, object::id(&accessory), accessory);
        memberNFT.image_url = new_image_url;
    }

    // ACC should be a type defined in this package
    // This allows members to edit the image of the NFT, which is a potential vulnerability.
    public fun remove_accessory<T, ACC: key + store> (
        memberNFT: &mut ClubMember<T>,
        accessory_id: ID,
        new_image_url: String
    ): ACC 
    {
        memberNFT.image_url = new_image_url;
        dof::remove<ID, ACC>(&mut memberNFT.id, accessory_id)
    }

    public fun new_display<T>(
        config: &mut Config,
        club: &mut Club<T>,
        description: String,
        ctx: &mut TxContext)
    {
        assert!(club.members.borrow(ctx.sender()) == &string::utf8(b"President"), EOnlyPresidentCanCreateDisplay);
        let keys: vector<String> = vector[
            string::utf8(b"name"),
            string::utf8(b"image_url"),
            string::utf8(b"description"),
        ];
        let mut name = *&club.name;
        name.append(string::utf8(b" club member"));
        let values: vector<String> = vector [
            name,
            string::utf8(b"{image_url}"), // take url from NFT
            description
        ];

        let mut display = display::new_with_fields<ClubMember<T>>(
            &config.publisher, keys, values, ctx
        );

        display::update_version(&mut display);
        transfer::public_transfer(display, ctx.sender());
    }

}