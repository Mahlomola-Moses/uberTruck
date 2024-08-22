<Stack.Screen name="(modal)/filter" options={{ presentation: "modal", headerTitle: "Filter", headerShadowVisible: false, headerStyle: { backgroundColor: Colors.lightGrey, }, headerLeft: ()=> (
    <TouchableOpacity onPress={()=> { navigation.goBack(); }} >
        <Ionicons name="close-outline" size={28} color={Colors.primary} />
    </TouchableOpacity>
    ), }} />
    <Stack.Screen name="(modal)/location-search" options={{ presentation: "fullScreenModal", headerTitle: "Select location", headerLeft: ()=> (
        <TouchableOpacity onPress={()=> { navigation.goBack(); }} >
            <Ionicons name="close-outline" size={28} color={Colors.primary} />
        </TouchableOpacity>
        ), }} />
        <Stack.Screen name="(modal)/dish" options={{ presentation: "modal", headerTitle: "", headerTransparent: true, headerLeft: ()=> (
            <TouchableOpacity style={{ backgroundColor: "#fff", borderRadius: 20, padding: 6, }} onPress={()=> { navigation.goBack(); }} >
                <Ionicons name="close-outline" size={28} color={Colors.primary} />
            </TouchableOpacity>
            ), }} />
            <Stack.Screen name="basket" options={{ headerTitle: "Basket", headerLeft: ()=> (
                <TouchableOpacity onPress={()=> { navigation.goBack(); }} >
                    <Ionicons name="arrow-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
                ), }} />


//2


                {/* {isLoggedIn ?? <Stack.Screen name="sign" />}
          <Stack.Screen
            name="index"
            options={{
              header: () => <CustomHeader />,
            }}
          />
          <Stack.Screen
            name="(modal)/filter"
            options={{
              presentation: "modal",
              headerTitle: "Filter",
              headerShadowVisible: false,
              headerStyle: { backgroundColor: Colors.lightGrey },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={28}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ),
            }}
          /> */}



            // options={{
            //   presentation: "fullScreenModal",
            //   headerTitle: "Select location",
            //   headerLeft: () => (
            //     <TouchableOpacity
            //       onPress={() => {
            //         navigation.goBack();
            //       }}
            //     >
            //       <Ionicons
            //         name="close-outline"
            //         size={28}
            //         color={Colors.primary}
            //       />
            //     </TouchableOpacity>
            //   ),
            // }}