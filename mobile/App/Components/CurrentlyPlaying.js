const React = require('react-native');
const STYLES = require('../Assets/PicoStyles.js');
const UI_HELPERS = require('../Utils/UiHelpers.js');
const SongQueue = require('./SongQueue.js');
const SERVER_ENDPOINT = require('../Auth/endpoints.js').serverEndpoint;

const {
	View,
	AlertIOS,
	Dimensions,
	Image,
	Text,
	StyleSheet,
	TouchableHighlight
} = React;

const ControlButton = props => {
	return (
		<TouchableHighlight
			onPress={props.pressHandler}>
			<View>
				<Text>{props.content}</Text>
			</View>
		</TouchableHighlight>
	);
};

class CurrentlyPlaying extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showingControls: false
		};
	}
	handlePress() {
		this.setState({showingControls: !this.state.showingControls});
	}
	handleViewQueue() {
		fetch(`${SERVER_ENDPOINT}/partyplaylist`)
	    .then(res => res.json())
	    .then(json => {
	      this.props.navigator.push({
	        title: 'Party',
	        passProps: {queue: json},
	        component: SongQueue
	      });
	    })
	    .catch(err => AlertIOS.alert('Error', `Error retrieving Party Playlist: ${err}`));
	}
	handleControlPress(control) {
		fetch(`${SERVER_ENDPOINT}/${control}song`)
	    .then(res => res.json())
	    .then(json => {
	      AlertIOS.alert('response', 'controlled the song');
	    })
	    .catch(err => AlertIOS.alert('Error', `Error retrieving Party Playlist: ${err}`));
	}
	renderControls() {
		if (!this.state.showingControls) return <View />;
		return (
			<View>
				<View>
					<ControlButton content="PLAY" pressHandler={this.handleControlPress.bind(this, 'play')} />
					<ControlButton content="PAUSE" pressHandler={this.handleControlPress.bind(this, 'pause')} />
					<ControlButton content="STOP" pressHandler={this.handleControlPress.bind(this, 'stop')} />
				</View>
				<TouchableHighlight onPress={this.handleViewQueue.bind(this)}>
					<Text>View Queue</Text>
				</TouchableHighlight>
			</View>
		);
	}
	render() {
		if (!this.props.trackObj) return <View />;
		let artwork = this.props.trackObj.artwork_url ?
			{uri: this.props.trackObj.artwork_url} : require("../Assets/Pico-O-grey.png");
		return (
			<View>
				<TouchableHighlight
					onPress={this.handlePress.bind(this)}>
					<View style={styles.container}>
						<Image
							style={STYLES.singleImage}
							source={artwork} />
						<View style={styles.trackInfoContainer}>
							<Text
								style={styles.trackInfo}
								numberOfLines={1}>
								{this.props.trackObj.title}
							</Text>
							<Text
								style={styles.trackInfo}
								numberOfLines={1}>
								{this.props.trackObj.genre}
							</Text>
							<Text style={styles.trackInfo}>
								{UI_HELPERS.makeHumanReadable(this.props.msRemaining)}
							</Text>
						</View>
					</View>
				</TouchableHighlight>
				{this.renderControls()}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		flex: 1,
		flexDirection: 'row',
		paddingTop: 5,
		paddingRight: 7,
		paddingBottom: 5,
		paddingLeft: 5,
		backgroundColor: STYLES.colors.PICO_GREEN
	},
	trackInfoContainer: {
		flexDirection: 'column'
	},
	trackInfo: {
		fontSize: 14,
	},
	nowPlayingText: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#000'
	},
});

module.exports = CurrentlyPlaying;