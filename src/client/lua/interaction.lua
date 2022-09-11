local config = json.decode(LoadResourceFile(GetCurrentResourceName(), "config.json"))
local bank_coords = config.bankBlips.coords
local atm_props = config.atms.props

local isInBankZone = false

CreateThread(function ()
    
  if not config.target.enabled then
    while true do
      local player_id = PlayerPedId()
      local player_coords = GetEntityCoords(player_id)
      local sleep = 1000
      isInBankZone = false
      for i = 1, #bank_coords do
        local pos = bank_coords[i]

        local distBank = #(player_coords - vector3(pos.x, pos.y, pos.z))
        if distBank <= 10.0 then
          DrawMarker(2, pos.x, pos.y, pos.z, 0.0, 0.0, 0.0, 0.0, 180.0, 0.0, 0.5, 0.5, 0.3, 255, 255, 255, 50, false, true, 2, nil, nil, false)

          if distBank <= 4.5 then
            exports['sd-hud']:ShowNotification('[Left ALT] - Atidaryti banką')
            isInBankZone = true
          end
          sleep = 0
        end
      end

      Wait(sleep)
    end
  end
end)


exports('isInBankZone', function ()
  return isInBankZone
end)