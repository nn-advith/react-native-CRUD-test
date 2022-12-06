
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import {useState,useCallback, useEffect, useRef} from 'react'
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as SplashScreen from 'expo-splash-screen';


SplashScreen.preventAutoHideAsync();

const Item = ({onPress, reason, date, amount, changeAction}) => {
  return <View 
  style={{width: '100%',height: 60, backgroundColor: '#333', paddingHorizontal: 10, paddingVertical: 8, marginVertical: 5, borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
  <View style={{display: 'flex',flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
    <TouchableOpacity 
    style={{width: 20, height: 20, borderColor: '#55ffb9', borderWidth: 2, borderRadius: 7, marginRight: 20}}
    onPress={onPress}
    ></TouchableOpacity>
    <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <Text  style={{color: '#fff', fontSize: 15, fontWeight: '700'}}>{reason}</Text>
      <Text  style={{color: '#888', fontSize: 12, fontWeight: '700'}}>{date}</Text>
    </View>
  </View>
  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
    <Text  style={{color: '#5bffb9', fontSize: 20, fontWeight: '700', marginRight: 20}}>₹ {amount}</Text>
    <TouchableOpacity 
    onPress={changeAction}
    style={{backgroundColor: '#55ffb9', display: 'flex', justifyContent: 'center', 
    alignItems: 'center',height: '130%',width: 50, marginRight: -10, borderTopRightRadius: 10, borderBottomRightRadius: 10}}
    >
    <Ionicons 
    name='pencil-sharp' color='#444' size={25}/>
    </TouchableOpacity>
  </View>
  </View>
}


export default function App() {
  const [dataM, setDataM ] = useState('')
  const [dataR, setDataR ] = useState('')
  const [ping, setPing] = useState('Hewwo')
  const [transactions, setTransactions] = useState(null)
  const [ipNo, setIpNo] = useState(0);
  const [action, setAction] = useState(0) // 0-add 1-update 
  const [id, setId] = useState('')
 

  const [loaded, setLoaded] = useState(false)

  let reqOne = axios.get("https://samplecrud-rn.onrender.com");
  let reqTwo = axios.get("https://samplecrud-rn.onrender.com/getTran");

  const ip1ref = useRef();

  const URI = 'https://samplecrud-rn.onrender.com'

  const getTransactions =  () => {
     axios({
      method: 'GET',
      url: URI+'/getTran',
    }).then(res => {setTransactions(res.data.data); console.log('trans')}).catch(err => console.log(err))
  }


  useEffect(() => {



    async function prepare() {


        axios.all([reqOne, reqTwo]).then(
          axios.spread((...res) => {
            setPing(res[0].data);
            setTransactions(res[1].data.data);
            // you can also set your states.
            setLoaded(true)
          })
        );
  


        // if(transactions.length){

        // }
   
    }

    prepare();

    
  }, [])


  const addData = () => {
    axios({
      method: 'POST',
      url:  URI+'/add',
      data: {
        amount: Number(dataM),
        reason: dataR
      }
    }).then((res) => {setPing(res.data.rep); getTransactions(); setDataM(''); setDataR(''); setIpNo(0); Keyboard.dismiss()}).catch(err => console.log(err))
  }

  const deleteItem = (i) => {
    axios({
      method: 'POST',
      url:  URI+'/delete',
      data: {
        id: i
      }
    }).then((res) => {setPing(res.data.rep); getTransactions()}).catch(err => console.log(err))
  }

  const updateItem = () => {
    
    axios({
      method: 'POST',
      url: URI+'/update',
      data: {
        amount: Number(dataM),
        reason: dataR,
        id: id
      }
    }).then((res) => {setPing(res.data.rep); setAction(1); getTransactions(); Keyboard.dismiss(); setIpNo(0); setDataM(''); setDataR(''); setId('')}).catch((e) => console.log(e))
    // setAction(0)
  }

  const renderItem = ( {item} ) => (
    <Item onPress={() => deleteItem(item._id)} 
    reason={item.reason} 
    date={item.date} amount={item.amount} 
    changeAction={() => {setAction(1); setIpNo(0); setDataM(item.amount.toString()); setDataR(item.reason); setId(item._id); ip1ref.current.focus()}}

    />
  );


  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [loaded]);


  if (!loaded ) {
    return null;
  }


  return (
   
    <>
    <StatusBar style='light'/>
    <View style={styles.container}  onLayout={onLayoutRootView}>
      <View style={styles.leftFlex}>
        <Text style={styles.head}>{ping}</Text>
      </View>


      {ipNo === 0 ? 
        <View style={{width: '100%', display: 'flex', flexDirection: 'row', marginTop: 30, height: 50,}}>
        <TextInput placeholder='Enter amount' 
          style={{backgroundColor: '#fff', width: '70%',  padding: 5, borderRadius: 10, paddingHorizontal: 10, fontSize: 15, fontWeight: '600'}}
          value={dataM} onChangeText={(e) => {setDataM(e);}}
          keyboardType='numeric' 
          ref={ip1ref}
          onBlur={() => {setAction(0); setDataM(''); setDataR(''); setId('')}}
        />
        <TouchableOpacity 
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '24%', backgroundColor: '#5bffb9', marginLeft: 20, borderRadius: 10 }}
          onPress={() => setIpNo(1)}
        >
          <Text style={{color: '#111', fontWeight: '600'}}>Next</Text>
        </TouchableOpacity>  
        </View>


        :

        <View style={{width: '100%', display: 'flex', flexDirection: 'row', marginTop: 30, height: 50,}}>
        <TextInput placeholder='Enter reason' style={{backgroundColor: '#fff', width: '70%',  padding: 5, borderRadius: 10, paddingHorizontal: 10, fontSize: 15, fontWeight: '600'}}
          value={dataR} onChangeText={(e) => {setDataR(e);}}
          keyboardType='ascii-capable'
        />
        <TouchableOpacity 
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '24%', backgroundColor: '#5bffb9', marginLeft: 20, borderRadius: 10 }}
          onPress={action === 0 ? addData : updateItem}
        >
          <Text style={{color: '#111', fontWeight: '600'}}>Submit</Text>
        </TouchableOpacity>  
        </View>

      }
        

      
      <View style={[styles.leftFlex, {marginTop: 30, flexDirection: 'column'}]}>
        <Text style={{color: '#5bffb9', fontSize: 25, fontWeight: '600',marginBottom: 20}}>Transactions</Text>
        <FlatList data={transactions}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                style={{height: '75%', width:'100%'}}
                showsVerticalScrollIndicator={false}
        >
        </FlatList>
      </View>
    </View>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#111',
    color: '#fff'
  },
  leftFlex: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'left',
    width: '100%'
  },
  head: {
    color: '#5BFFB9',
    fontSize: 30,
    fontWeight: 'bold'
  }
});
