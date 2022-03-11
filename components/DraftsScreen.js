import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class DraftsScreen extends Component {

    state = {
        posts: []
    }

    componentDidMount() {
        //refreshes data if this page is focused
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getPosts();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    getPosts = async () => {
        //gets id and posts from async-storage        
        let id = await AsyncStorage.getItem('userID');
        let savedPosts = await AsyncStorage.getItem('posts' + id);

        if (savedPosts == null) {
            savedPosts = []; //creates an empty array if there are no saved posts
        }
        else {
            savedPosts = JSON.parse(savedPosts);
        }

        this.setState({ posts: savedPosts })
    }

    updatePost = (index, value) => {
        let savedPosts = this.state.posts;

        savedPosts[index] = value;

        this.setState({ posts: savedPosts })
    }

    makePost = async (index) => {
        //gets the signed in user's ID and authorisation token in async storage
        let id = await AsyncStorage.getItem('userID');
        let sessionToken = await AsyncStorage.getItem('token');

        let savedPosts = this.state.posts;

        return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': sessionToken
            },
            body: JSON.stringify({
                "text": savedPosts[index]
            })
        })
            .then((response) => {
                //checks the response code before returning the json
                if (response.status === 201) {
                    console.log('Post created');
                    this.deletePost(index);
                    this.getPosts();
                } else if (response.status === 401) {
                    this.props.navigation.navigate("Login");
                } else {
                    throw 'Something went wrong';
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }

    deletePost = async (postID) => {
        let id = await AsyncStorage.getItem('userID');
        let savedPosts = this.state.posts;

        savedPosts.splice(postID, 1);

        await AsyncStorage.setItem('posts' + id, JSON.stringify(savedPosts));

        this.getPosts()
    }

    savePosts = async () => {
        let id = await AsyncStorage.getItem('userID');
        let savedPosts = this.state.posts;

        await AsyncStorage.setItem('posts' + id, JSON.stringify(savedPosts));

        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.title}>SpaceBook</Text>
                    <Text style={styles.text}>Edit Drafts</Text>
                </View>

                <FlatList
                    data={this.state.posts}
                    renderItem={({ item, index }) => (
                        <View style={styles.post}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontStyle: 'italic' }}><Text>Draft {index + 1}</Text></Text>
                                <Text style={{ fontStyle: 'italic' }}>Unposted</Text>
                            </View>

                            <TextInput
                                style={styles.input}
                                onChangeText={value => this.updatePost(index, value)}
                                placeholder="Edit post"
                                multiline={true}
                                numberOfLines={2}
                                value={item}
                            />

                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ marginRight: 5 }}>
                                    <Button
                                        title='Post'
                                        onPress={() => this.makePost(index)}
                                        color="#19a9f7"
                                    />
                                </View>
                                <Button
                                    title='Delete'
                                    onPress={() => this.deletePost(index)}
                                    color="red"
                                />
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ padding: 5 }}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={styles.button}>
                        <Button
                            title='Save'
                            onPress={() => this.savePosts()}
                            color="#19a9f7"
                        />
                    </View>

                    <View style={styles.button}>
                        <Button
                            title='Back'
                            onPress={() => this.props.navigation.goBack()}
                            color="#19a9f7"
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        fontFamily: "Helvetica",
        flex: 1
    },
    title: {
        color: '#19a9f7',
        fontWeight: 'bold',
        fontSize: 'min(16vw, 500%)'//css sets title to 16% of the viewpoint width but never more than the font size 500%
    },
    text: {
        padding: 5,
        fontSize: '120%',
    },
    button: {
        margin: 10,
        alignItems: 'center'
    },
    input: {
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 3
    },
    post: {
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        margin: 5,
        padding: 5
    }
});

export default DraftsScreen;