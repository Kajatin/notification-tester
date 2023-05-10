//
//  Model.swift
//  Notification Tester
//
//  Created by Roland Kajatin on 09/05/2023.
//

import Foundation

struct Model: Codable {
    var notificationCount = 0
    var scheduleStartedAt = Date()
    var lastNotificationDate = Date()
    var showNotificationRequest = false
    var scheduleOn = false
    
    init() { }
    
    init(json: Data) throws {
        self = try JSONDecoder().decode(Model.self, from: json)
    }
    
    init(url: URL) throws {
        let data = try Data(contentsOf: url)
        self = try Model(json: data)
    }
    
    func json() throws -> Data {
        return try JSONEncoder().encode(self)
    }
    
    mutating func resetValues() {
        notificationCount = 0
        lastNotificationDate = Date()
        scheduleOn = false
    }
}
