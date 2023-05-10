//
//  ViewModel.swift
//  Notification Tester
//
//  Created by Roland Kajatin on 09/05/2023.
//

import SwiftUI

class ViewModel: ObservableObject {
    @Published private(set) var model: Model {
        didSet {
            autosave()
        }
    }
    
    private var notificationManager: NotificationManager?
    private var notificationAuthorized = false
    
    init() {
        if let url = Autosave.url, let autosavedModel = try? Model(url: url) {
            self.model = autosavedModel
        } else {
            self.model = Model()
        }
        
        notificationManager = NotificationManager() {
            self.model.notificationCount += 1
            self.model.lastNotificationDate = Date()
        }
        
        // Request notification authorization if it's not already given
        notificationManager!.isAuthorization { settings in
            if (settings.authorizationStatus == .notDetermined) {
                self.model.showNotificationRequest = true
            }
            self.notificationAuthorized = settings.authorizationStatus == .authorized
        }
        // Cancel pending teton-notification-hehe notifications
        model.scheduleOn = false
    }
    
    private struct Autosave {
        static let filename = "Autosave.notificationtester"
        static var url: URL? {
            let documentDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first
            return documentDirectory?.appendingPathComponent(filename)
        }
    }
    
    private func autosave() {
        if let url = Autosave.url {
            save(to: url)
        }
    }
    
    private func save(to url: URL) {
        let thisFunction = "\(String(describing: self)).\(#function)"
        do {
            let data: Data = try model.json()
            //            print("\(thisFunction) json = \(String(data: data, encoding: .utf8) ?? "nil")")
            try data.write(to: url)
            //            print("\(thisFunction) success!")
        } catch {
            print("\(thisFunction) = \(error)")
        }
    }
    
    var showNotificationRequest: Bool {
        get { return model.showNotificationRequest }
        set { model.showNotificationRequest = newValue }
    }
    
    func requestNotificationPermissions(skipped: Bool = false) {
        if !skipped {
            notificationManager!.requestAuthorization { (granted, error) in
                if let error = error {
                    // Handle the error here.
                    print(error)
                }
                
                // Enable or disable features based on the authorization.
                
                // Check if we're authorized to send notifications
                self.notificationManager!.isAuthorization { settings in
                    self.notificationAuthorized = settings.authorizationStatus == .authorized
                }
            }
        }
        
        model.showNotificationRequest = false
    }
    
    // MARK: Intents
    
    func sendNotificationNow() {
        // Schedule new notification
        notificationManager!.scheduleTimeToDrinkNotification(timeInterval: 3, repeats: false) { error in
            if error != nil {
                // Handle any errors.
            }
        }
    }
    
    func startNotificationSchedule() {
        notificationManager!.cancelPreviousNotifications()
        
        model.scheduleOn = true
        model.scheduleStartedAt = Date()
        
        notificationManager!.scheduleTimeToDrinkNotification(timeInterval: 60, repeats: true) { error in
            if error != nil {
                // handle error
            }
        }
    }
    
    func stopNotificationSchedule() {
        model.scheduleOn = false
        notificationManager!.cancelPreviousNotifications()
    }
    
    func resetModel() {
        stopNotificationSchedule()
        model.resetValues()
    }
}
