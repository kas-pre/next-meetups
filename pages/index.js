import Head from 'next/head';
import { MongoClient } from 'mongodb';
import { Fragment } from 'react';

import MeetupList from '../components/meetups/MeetupList';

function HomePage(props) {
	return (
		<Fragment>
			<Head>
				<title>Next Meetups</title>
				<meta name="description" content="Browse a huge collection of highly active React meetups!" />
			</Head>
			<MeetupList meetups={props.meetups} />;
		</Fragment>
	);
}

// // for every incoming request
// export async function getServerSideProps(context) {
// 	const req = context.req;
// 	const res = context.res;
// 	//fetch data from an API
// 	return {
// 		props: DUMMY_MEETUPS
// 	};
// }

//for static site generation
// take advantage of caching
export async function getStaticProps() {
	// fetch data from an API
	const client = await MongoClient.connect(
		'mongodb+srv://kp:kp@cluster0.sbo18.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find().toArray();

	client.close();

	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString()
			}))
		},
		// handle frequent data changes - incremental SSG
		revalidate: 1
	};
}

export default HomePage;
