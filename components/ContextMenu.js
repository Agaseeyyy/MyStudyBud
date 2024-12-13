import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function ContextMenu({ icon, color, options = [] }) {
  return (
    <View className='items-center justify-center flex-1'>
      <Menu>
        <MenuTrigger>
          <View className='p-3 rounded-full'>
            <MaterialIcons name={icon} size={25} color={color} />
          </View>
        </MenuTrigger>
        <MenuOptions className='bg-white'>
          {options.map((option, index) => (
            <MenuOption key={index} onSelect={option.onSelect}>
              <Text className='p-3 text-lg font-LexendDecaMedium'>{option.label}</Text>
            </MenuOption>
          ))}
        </MenuOptions>
      </Menu>
    </View>
  );
}
