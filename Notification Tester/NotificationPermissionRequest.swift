//
//  NotificationPermissionRequest.swift
//  Notification Tester
//
//  Created by Roland Kajatin on 09/05/2023.
//

import SwiftUI

struct NotificationPermissionRequest: View {
    @EnvironmentObject var viewModel: ViewModel
    
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        VStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 25) {
                Image(systemName: "bell.badge.fill")
                    .frame(width: 64, height: 64)
                    .foregroundColor(.white)
                    .scaleEffect(1.8)
                    .background(Color(red: 234/255, green: 79/255, blue: 61/255))
                    .cornerRadius(12)
                Text("Teton wants to send you notifications")
                    .font(.title)
                    .bold()
                Text("This is very important. You should say yes.")
            }
            .padding(.top, 140)
            
            Spacer()
            
            Button {
                viewModel.requestNotificationPermissions()
            } label: {
                Text("Allow Notifications")
                    .font(.headline)
                    .padding(.vertical, 5)
                    .frame(maxWidth: .infinity)
            }
            .padding(.bottom)
            .buttonStyle(.borderedProminent)
        }
        .padding(.horizontal, 30)
        .background(colorScheme == .dark ? .clear : .gray.opacity(0.15))
    }
}

struct NotificationPermissionRequest_Previews: PreviewProvider {
    static let viewModel = ViewModel()
    
    static var previews: some View {
        NotificationPermissionRequest().environmentObject(viewModel)
    }
}
