import React from 'react';
import { View, Text, } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function ContextMenu({ 
  icon, 
  color = '#A0D683', 
  options = [], 
  iconSize = 25,
  backgroundColor = 'white',
  textColor = 'black',
  menuStyle = {},
  iconStyle = {},
  optionStyle = {},
}) {
  return (
    <View className='items-center justify-center flex-1'>
      <Menu>
        <MenuTrigger>
          <View 
            className='p-3 rounded-full' 
            style={[iconStyle]}
          >
            <MaterialIcons 
              name={icon} 
              size={iconSize} 
              color={color} 
            />
          </View>
        </MenuTrigger>
        <MenuOptions 
          customStyles={{
            optionsContainer: [
              { 
                backgroundColor: backgroundColor,
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              },
              menuStyle
            ],
          }}
        >
          {options.map((option, index) => (
            <MenuOption 
              key={index} 
              onSelect={option.onSelect}
              customStyles={{
                optionWrapper: [
                  {
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: index < options.length - 1 ? 1 : 0,
                    borderBottomColor: '#E5E5E5',
                  },
                  optionStyle
                ],
              }}
            >
              {option.icon && (
                <MaterialIcons 
                  name={option.icon} 
                  size={20} 
                  color={color} 
                  style={{ marginRight: 10 }} 
                />
              )}
              <Text 
                className='text-base font-LexendDecaMedium'
                style={{ color: textColor }}
              >
                {option.label}
              </Text>
            </MenuOption>
          ))}
        </MenuOptions>
      </Menu>
    </View>
  );
}