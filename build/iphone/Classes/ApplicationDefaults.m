/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 * WARNING: This is generated code. Do not modify. Your changes *will* be lost.
 */

#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"

@implementation ApplicationDefaults

+ (NSMutableDictionary*) copyDefaults
{
	NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];
	
	[_property setObject:[TiUtils stringValue:@"201613399910723"] forKey:@"ti.facebook.appid"];
	[_property setObject:[TiUtils stringValue:@"I35zE886z7j41lZnk8Y1jjMi7EN0NB4r"] forKey:@"acs-oauth-secret-development"];
	[_property setObject:[TiUtils stringValue:@"NoOvhxdG6DHMIZMixiFxNigzAJvEhPkS"] forKey:@"acs-oauth-key-development"];
	[_property setObject:[TiUtils stringValue:@"PXoSQeWvDkJ0gUArBIhcXMggvmWwnOyL"] forKey:@"acs-api-key-development"];
	[_property setObject:[TiUtils stringValue:@"KeULCsUmhv6TIwghPeXFFademJ0sPoIY"] forKey:@"acs-oauth-secret-production"];
	[_property setObject:[TiUtils stringValue:@"53CTV3WmOh0HUlNW6B0M4XgYJblsVuHa"] forKey:@"acs-oauth-key-production"];
	[_property setObject:[TiUtils stringValue:@"fZuIdM1Un78R1BORAdrfGTNbkdh1Udwb"] forKey:@"acs-api-key-production"];
	[_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];
	return _property;
}

@end