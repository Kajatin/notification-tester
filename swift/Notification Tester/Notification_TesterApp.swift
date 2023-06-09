//
//  Notification_TesterApp.swift
//  Notification Tester
//
//  Created by Roland Kajatin on 09/05/2023.
//

import SwiftUI

@main
struct Notification_TesterApp: App {
    let viewModel = ViewModel()
    
    var body: some Scene {
        WindowGroup {
            ContentView().environmentObject(viewModel)
        }
    }
}
