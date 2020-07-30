/*
// regpack options
{
  withMath: false,
  hash2DContext: true,
  hashWebGLContext: false,
  hashAudioContext: false,
  contextVariableName: "c",
  contextType: 0,
  reassignVars: true,
  varsNotReassigned: "a b c d", // js1024
  crushGainFactor: 6,
  crushLengthFactor: 2,
  crushCopiesFactor: 2,
  crushTiebreakerFactor: 1,
  wrapInSetInterval: false,
  timeVariableName: "",
  useES6: true
}
*/

p=[]
F=400
V=650
W=220
N=100
B=t=0
S=16
T=30
Q=1450
f=.2

// draw function (array, offset, linespan, length, time(for animation), alpha)
dr=(q,p,m,l,t,A) => {
    // run the loop twice to reuse as much variables and loops as possible
    // the first iteration will do the projection
    // while the second iteration will do the actual rendering
    for(g=2;g--;)
        for(j=0,k=p;j<(t?l:g?l:1);k++){
            //if it's water animate it slightly
            K=(q[k][1]>=Q?40:0)*Math.sin(j+++t*.06)
            z = q[k][2] -t*f+K
            
            // will be transformed to g?(...):(...) by terser
            if(g) {
                // calculate projection
                q[k][4]=F*q[k][0]/z + a.width/2
                q[k][5]=F*(q[k][1]+K)/z + (t?a.height/2:N)
            } else {
                // if any quad is behind the field of view enable
                // to remove one line after all rendering has been done.
                Z|=z < N
                C=q[k][3]

                // quick & dirty cross product to do lighting calculations
                e=q[k+m][1]-q[k][1]
                d=q[k+m][2]-q[k][2]
                u=q[k+1][0]-q[k][0]
                u=[e-d*(q[k+1][1]-q[k][1]), d*u, -e*u]
                u=u.map(e=>e/Math.hypot(u[0],u[1],u[2]))
                
                // factor current color by lighting calc. approx
                // (40% ambient + 60% lighting)
                // u=.4+.6*(u[0]*f+(t?u[1]:u[1]*f+u[2]))
                // C=X[q[k].c]
                // c.fillStyle='rgba(' + C[0]*u + ',' + C[1]*u + ',' + C[2]*u + ','+A+')')
                c.fillStyle=`hsla( ${(!C?7:C==1?18:'')}0, ${(C==2?0:7)}0%, ${(C==2?9:5)*(4+6*(u[0]*f+(t?u[1]:u[1]*f+u[2])))}%, ${A})`
                
                c.beginPath()
                c.lineTo(q[k][4],    q[k][5])
                c.lineTo(q[k+1][4],  q[k+1][5])
                c.lineTo(q[k+m+1][4],q[k+m+1][5])
                c.lineTo(q[k+m][4],  q[k+m][5])
                c.fill()
            }
        }
}

setInterval(()=>{
    with(Math) {
        // clear the screen
        c.fillStyle='#28a'
        c.fillRect(0,0,1e4,1e4)

        //small cloud! - did not fit under 1k =)
        // c.fillStyle='#fff8'
        // for(i=W;i--;c.fill()){
        //     k=abs(sin(i*f+t*.0001))
        //     c.beginPath()
        //     c.arc(i*T/2,N+S*k*k-T*k/2,T*k,0,6)
        // }

        // generate lines of terrain until we have N
        for(;(A=p.length)<N*N;B++) {
            // N random points with a central valley limited to '10'.
            // Change the '>10?10' for another value to change the depth
            for(j=N;j--;p[p.length]=[k*N + W*sin(B*f), (random()/2+.3*(n>10?10:n))*1e3-Q, F+B * N, 0])
                k=N/2-j,
                n=N/abs(k)
                
            

            // smooth the points with it's 3 close neighbours.
            // this proces is done 3 times, otherwise results are too rough
            for(Z=3;--Z;)
                for(j=N;j--;p[k][3]=p[k][1]<W?2:p[k][1]<Q?0:1)
                    k=A-N-j,
                    p[k][1]=(p[k][1] + p[k-1][1] + p[k-N][1])/3

                    // assign color index based on height
                    //-- moved to for statement
                    //p[k].c=p[k].y<W?2:p[k].y<Q?0:1
        }

        // draw slices terrain from farthest to nearest to do a 'natural'
        // depth sorting
        // alpha goes from 1 (full opacity) on the front layers to 
        // 0 (full transparent) on the back layers
        for(i=A/N-2;i--;) dr(p,i*N,N,N-1,t++,1-i*N/A)

        // if any layer went behind the screen, remove one line of points
        // a new one will be randomly generated on next iteration at the back
        //
        // terser will move this statement to the for loop below:
        // for(Z&&(p=p.slice(N));++i<=S;)
        Z&&(p=p.slice(N))

        // draw the balloon, adding 2 iterations vertically to draw the basket
        // or something similar to a basket ;)
        for(;++i<=S;)
            for(n=S;n--;dr([[s*g, i*T, s*e+V, x], [s*m, i*T, s*d+V, x], [b*g, i*T+T, b*e+V, x], [b*m, i*T+T, b*d+V, x]],0,2,4,0,1)) {
                //color would be alternating white/red each vertical stripe
                x=2+n%2

                g=cos(n*f)
                m=cos(n*f+f)
                e=sin(n*f)
                d=sin(n*f+f)
                s=W*sin(i*f)
                b=W*sin(i*f+f)

                //generate the points and draw
                // -- moved to for loop statement
                // dr([{x:s*g,  y:i*T,   z:s*e+V, c:x},
                //     {x:s*m,  y:i*T,   z:s*d+V, c:x},
                //     {x:b*g,  y:i*T+T, z:b*e+V, c:x},
                //     {x:b*m,  y:i*T+T, z:b*d+V, c:x}],0,2,4,0,1)
            }
    }
})